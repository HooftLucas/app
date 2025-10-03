from supabase import create_client
from dotenv import load_dotenv
import os

load_dotenv()
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

print('SUPABASE_URL:', SUPABASE_URL)
print('SUPABASE_KEY exists:', bool(SUPABASE_KEY))

if not SUPABASE_URL or not SUPABASE_KEY:
    print('Missing SUPABASE_URL or SUPABASE_KEY in environment')
    exit(1)

try:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    print('Supabase client created')

    # Try a select
    resp = supabase.table('oefeningen').select('*').limit(1).execute()
    data, error = resp
    if error:
        print('Select error:', error)
    else:
        print('Select OK:', data)

    # Try an insert
    test_row = {
        'titel': 'Connectivity test',
        'doelgroep': 'U12',
        'duur': 5,
        'categorie': 'offense',
        'topics': ['Test'],
        'positions': [],
        'teaching_points': ['conn'],
        'beschrijving': 'connectivity test',
        'diagram': []
    }

    resp2 = supabase.table('oefeningen').insert(test_row).execute()
    data2, error2 = resp2
    if error2:
        print('Insert error:', error2)
    else:
        print('Insert OK:', data2)

except Exception as e:
    print('Exception while testing Supabase:', e)
