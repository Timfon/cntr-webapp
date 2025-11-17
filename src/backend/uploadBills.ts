import * as Papa from 'papaparse';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

let supabaseClient: any = null;

// Initialize Supabase client
function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;

  if (typeof window !== 'undefined') {
    throw new Error('uploadBills can only be called from server-side code');
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  }

  supabaseClient = createClient(supabaseUrl, supabaseServiceKey);
  return supabaseClient;
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
 * Parse bills from CSV and upload them to Supabase
 * external_id format: {state} {bill_number} {first_action_date}
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

    // Transform CSV data to Supabase bill format
    const bills: any[] = [];

    for (const row of parseResult.data) {
      try {
        // Generate external_id: {state} {bill_number} {first_action_date}
        const externalId = `${row.state} ${row.bill_number} ${row.first_action_date}`.trim();

        // Extract year from first_action_date
        const year = parseInt(row.first_action_date?.split('-')[0]) || new Date().getFullYear();

        // Map body to enum value (lowercase)
        const bodyValue = row.body?.trim().toLowerCase();
        let body: 'house' | 'senate' | 'assembly';
        if (bodyValue === 'house') {
          body = 'house';
        } else if (bodyValue === 'senate') {
          body = 'senate';
        } else if (bodyValue === 'assembly') {
          body = 'assembly';
        } else {
          console.warn(`Unknown body type: ${row.body}, defaulting to 'house'`);
          body = 'house';
        }

        const bill = {
          external_id: externalId,
          title: row.title?.trim() || "",
          summary: row.description?.trim() || "",
          url: row.state_link?.trim() || "",
          version_date: row.first_action_date?.trim() || null,
          state: row.state?.trim() || "",
          year: year,
          bill_number: row.bill_number?.trim() || "",
          body: body,
        };

        bills.push(bill);
      } catch (error) {
        console.error('Error processing row:', error);
        console.error('Row data:', row);
      }
    }

    console.log(`Transformed ${bills.length} bills`);

    // Get Supabase client
    const supabase = getSupabaseClient();

    // Upload to Supabase in batches
    console.log(`Uploading ${bills.length} bills to Supabase...`);

    let successCount = 0;
    let errorCount = 0;
    const errorMessages: string[] = [];

    // Upload in batches of 100 for better performance
    const batchSize = 100;
    for (let i = 0; i < bills.length; i += batchSize) {
      const batch = bills.slice(i, i + batchSize);

      try {
        const { data, error } = await supabase
          .from('bills')
          .upsert(batch, {
            onConflict: 'external_id',
            ignoreDuplicates: false
          });

        if (error) {
          const errorMsg = `Error uploading batch ${i / batchSize + 1}: ${error.message}`;
          console.error(errorMsg);
          errorMessages.push(errorMsg);
          errorCount += batch.length;
        } else {
          successCount += batch.length;
          console.log(`  Progress: ${Math.min(i + batchSize, bills.length)}/${bills.length} bills uploaded...`);
        }
      } catch (error: any) {
        const errorMsg = `Error uploading batch ${i / batchSize + 1}: ${error.message}`;
        console.error(errorMsg);
        errorMessages.push(errorMsg);
        errorCount += batch.length;
      }
    }

    console.log('\n🎉 Bill upload complete!');
    console.log(`✅ Successfully uploaded: ${successCount} bills`);
    if (errorCount > 0) {
      console.log(`❌ Errors: ${errorCount} bills`);
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

