Supabase integration tests

Instructions:
1. Ensure your `.env` in this folder contains SUPABASE_URL and SUPABASE_KEY (service role key).
2. Install dependencies: `pip install -r requirements.txt`
3. Run the test: `python tests/supabase_integration_test.py`

The test will attempt to SELECT from `oefeningen`, INSERT a temporary row, READ it back, UPDATE it and DELETE it. It exits with code 0 on success and non-zero on failure.
