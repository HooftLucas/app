from supabase import create_client
from dotenv import load_dotenv
import os
import sys

load_dotenv()
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

if not SUPABASE_URL or not SUPABASE_KEY:
    print('MISSING_ENV: SUPABASE_URL or SUPABASE_KEY not set')
    sys.exit(2)

print('Using SUPABASE_URL:', SUPABASE_URL)

try:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    print('Supabase client created')
except Exception as e:
    print('CLIENT_ERROR:', e)
    sys.exit(3)

def normalize(resp):
    try:
        if isinstance(resp, tuple):
            data = resp[0]
            meta = resp[1] if len(resp) > 1 else None
            if isinstance(meta, dict) and ('message' in meta or 'code' in meta):
                return None, meta
            return data, None
        if isinstance(resp, dict):
            return resp.get('data'), resp.get('error')
        data = getattr(resp, 'data', None)
        err = getattr(resp, 'error', None)
        return data, err
    except Exception as e:
        return None, {'message': str(e)}

# 1) Check table exists by selecting small set
print('\nSTEP 1: checking table existence (select 1)')
resp = supabase.table('oefeningen').select('*').limit(1).execute()
data, err = normalize(resp)
if err:
    print('TABLE_CHECK_ERROR:', err)
    sys.exit(4)
print('TABLE_CHECK_OK: returned', data)

# 2) Insert a test row
print('\nSTEP 2: inserting test row')
test_row = {
    'titel': 'integration test - temp',
    'doelgroep': 'U12',
    'duur': 3,
    'categorie': 'test',
    'topics': ['integration'],
    'positions': [],
    'teaching_points': ['t1'],
    'beschrijving': 'temporary record',
    'diagram': []
}
resp = supabase.table('oefeningen').insert(test_row).execute()
inserted, err = normalize(resp)
if err:
    print('INSERT_ERROR:', err)
    sys.exit(5)
# inserted may be list or dict
rec = inserted[0] if isinstance(inserted, list) and inserted else inserted
print('INSERT_OK:', rec)
rec_id = rec.get('id') if isinstance(rec, dict) else None
if not rec_id:
    print('INSERT_NO_ID, abort')
    sys.exit(6)

# 3) Read back by id
print('\nSTEP 3: fetching by id')
resp = supabase.table('oefeningen').select('*').eq('id', rec_id).execute()
fetched, err = normalize(resp)
if err:
    print('FETCH_ERROR:', err)
    sys.exit(7)
print('FETCH_OK:', fetched)

# 4) Update the record
print('\nSTEP 4: updating record')
update_payload = {'titel': 'integration test - updated'}
resp = supabase.table('oefeningen').update(update_payload).eq('id', rec_id).execute()
updated, err = normalize(resp)
if err:
    print('UPDATE_ERROR:', err)
    sys.exit(8)
print('UPDATE_OK:', updated)

# 5) Delete the record
print('\nSTEP 5: deleting record')
resp = supabase.table('oefeningen').delete().eq('id', rec_id).execute()
deleted, err = normalize(resp)
if err:
    print('DELETE_ERROR:', err)
    sys.exit(9)
print('DELETE_OK:', deleted)

print('\nALL_TESTS_PASS')
sys.exit(0)
