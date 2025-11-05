import * as Papa from 'papaparse';
import fs from 'fs';
import path from 'path';
import { Bill } from '@/types/database';

// For server-side admin operations, use Firebase Admin SDK
let adminDb: any = null;

// Lazy initialize Firebase Admin SDK
async function getAdminDb() {
  if (adminDb) return adminDb;
  
  if (typeof window !== 'undefined') {
    throw new Error('uploadBills can only be called from server-side code');
  }
  
  try {
    const admin = await import('firebase-admin');
    
    if (!admin.apps.length) {
      let serviceAccount: any = null;
      
      if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      } else {
        const serviceAccountPath = path.join(process.cwd(), 'firebase-admin.json');
        if (fs.existsSync(serviceAccountPath)) {
          serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));
        }
      }
      
      if (serviceAccount) {
        // Use service account from file or environment
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount)
        });
      } else {
        // Use default credentials (e.g., on Google Cloud, local emulator with credentials)
        admin.initializeApp();
      }
    }
    
    adminDb = admin.firestore();
    return adminDb;
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error);
    throw error;
  }
}

interface CSVBill {
  bill_ids: string;
  status: string;
  Spectrum: string;
  bill_progress: string;
  relevance: string;
  bill_id: string;
  session: string;
  url: string;
  state_link: string;
  status_date: string;
  progress: string;
  state: string;
  bill_number: string;
  bill_type: string;
  body: string;
  current_body: string;
  title: string;
  description: string;
  history: string;
  sponsors: string;
  sasts: string;
  subjects: string;
  texts: string;
  votes: string;
  amendments: string;
  first_action_date: string;
  latest_action_date_legiscan: string;
  first_progress_date_legiscan: string;
}

export interface UploadBillsResult {
  success: boolean;
  total: number;
  uploaded: number;
  errors: number;
  errorMessages?: string[];
}

/**
 * Parse bills from CSV and upload them to Firestore
 * Bill ID format: {state} {bill_number} {first_action_date}
 * 
 * @returns Upload result with statistics
 */
export async function uploadBills(): Promise<UploadBillsResult> {
  try {
    console.log('Reading bills.csv...');
    
    // Get the CSV file path
    const csvPath = path.join(process.cwd(), 'src/app/data/bills.csv');
    
    // Check if file exists
    if (!fs.existsSync(csvPath)) {
      throw new Error(`CSV file not found at: ${csvPath}`);
    }
    
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    
    // Parse CSV with PapaParse
    const parseResult = Papa.parse<CSVBill>(csvContent, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => header.trim(),
    });
    
    console.log(`Parsed ${parseResult.data.length} bills from CSV`);
    
    if (parseResult.errors.length > 0) {
      console.warn('CSV parsing warnings:', parseResult.errors.slice(0, 5));
    }
    
    // Transform CSV data to Bill format
    const bills: (Bill & { billId: string })[] = [];
    
    for (const row of parseResult.data) {
      try {
        // Generate bill ID: {state} {bill_number} {first_action_date}
        const billId = `${row.state} ${row.bill_number} ${row.first_action_date}`.trim();
        
        // Extract year from session or first_action_date
        const year = row.first_action_date?.split('-')[0];
        
        const bill: Bill & { billId: string } = {
          billId: billId,
          title: row.title?.trim() || "",
          description: row.description?.trim() || "",
          url: row.state_link?.trim() || "",
          versionDate: row.first_action_date?.trim() || "",
          state: row.state?.trim() || "",
          year: parseInt(year) || new Date().getFullYear(),
          number: row.bill_number?.trim() || "",
          body: row.body?.trim() || "",
        };  
        
        bills.push(bill);
      } catch (error) {
        console.error('Error processing row:', error);
        console.error('Row data:', row);
      }
    }
    
    console.log(`Transformed ${bills.length} bills`);
    
    // Get Firestore admin instance
    const db = await getAdminDb();
    
    // Upload to Firestore
    console.log(`Uploading ${bills.length} bills to Firestore...`);
    
    let successCount = 0;
    let errorCount = 0;
    const errorMessages: string[] = [];
    
    for (const bill of bills) {
      try {
        // Use bill.billId as the document ID
        await db.collection('bills').doc(bill.billId).set({
          title: bill.title,
          description: bill.description,
          url: bill.url,
          versionDate: bill.versionDate,
          state: bill.state,
          year: bill.year,
          number: bill.number,
          body: bill.body,
        });
        successCount++;
        
        if (successCount % 100 === 0) {
          console.log(`  Progress: ${successCount}/${bills.length} bills uploaded...`);
        }
      } catch (error: any) {
        const errorMsg = `Error uploading bill ${bill.billId}: ${error.message}`;
        console.error(`${errorMsg}`);
        errorMessages.push(errorMsg);
        errorCount++;
      }
    }
    
    console.log('\n🎉 Bill upload complete!');
    console.log(`✅ Successfully uploaded: ${successCount} bills`);
    if (errorCount > 0) {
      console.log(`Errors: ${errorCount} bills`);
    }
    
    return {
      success: errorCount === 0,
      total: bills.length,
      uploaded: successCount,
      errors: errorCount,
      errorMessages: errorMessages.length > 0 ? errorMessages : undefined
    };
    
  } catch (error: any) {
    console.error('Fatal error:', error);
    throw error;
  }
}

// Allow direct execution for testing
if (require.main === module) {
  uploadBills()
    .then((result) => {
      console.log('Done!');
      console.log('Result:', result);
      process.exit(result.success ? 0 : 1);
    })
    .catch((error) => {
      console.error('Failed:', error);
      process.exit(1);
    });
}

