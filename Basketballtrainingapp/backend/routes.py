from flask import Blueprint, request, jsonify
from models import Oefening
import os
from dotenv import load_dotenv
import logging

# Try to load .env in development
load_dotenv()

SUPABASE_URL = os.environ.get('SUPABASE_URL')
SUPABASE_KEY = os.environ.get('SUPABASE_KEY')

use_supabase = bool(SUPABASE_URL and SUPABASE_KEY)

if use_supabase:
    try:
        from supabase import create_client
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    except Exception as e:
        supabase = None
        use_supabase = False
        print('Warning: could not initialize Supabase client:', e)

routes_blueprint = Blueprint('routes', __name__)

# If Supabase is not configured, fall back to in-memory storage (for dev)
oefeningen_cache = []

# Helper to normalize supabase responses which may vary between client versions
def _normalize_supabase_response(resp):
    """Return (data, error) given a supabase client response which can be tuple, dict, or object."""
    # Tuple-like (data, meta/count)
    try:
        if isinstance(resp, tuple) and len(resp) >= 1:
            data = resp[0]
            # Some versions include count or error-like dict as second element; try to detect error
            meta = resp[1] if len(resp) > 1 else None
            # If meta is dict and contains 'message' or 'code', treat as error
            if isinstance(meta, dict) and ('message' in meta or 'code' in meta or 'details' in meta):
                return None, meta
            return data, None

        # dict-like
        if isinstance(resp, dict):
            # Postgrest style: { 'data': [...], 'error': {...} }
            if 'data' in resp or 'error' in resp:
                return resp.get('data'), resp.get('error')
            return resp, None

        # object with attributes
        data = getattr(resp, 'data', None)
        error = getattr(resp, 'error', None)
        if data is not None or error is not None:
            return data, error

        # Fallback: return resp as data
        return resp, None
    except Exception as e:
        # Never raise here; return as error info
        return None, {'message': f'Could not normalize response: {e}'}

@routes_blueprint.route('/api/oefeningen', methods=['GET'])
def get_oefeningen():
    if use_supabase and supabase:
        resp = supabase.table('oefeningen').select('*').execute()
        data, error = _normalize_supabase_response(resp)
        if error:
            logging.error('Supabase select error: %s', error)
            return jsonify({'error': str(error)}), 500
        return jsonify({'oefeningen': data}), 200
    else:
        return jsonify({'oefeningen': oefeningen_cache}), 200

@routes_blueprint.route('/api/oefeningen/<int:id>', methods=['GET'])
def get_oefening(id):
    if use_supabase and supabase:
        resp = supabase.table('oefeningen').select('*').eq('id', id).execute()
        data, error = _normalize_supabase_response(resp)
        if error:
            logging.error('Supabase select by id error: %s', error)
            return jsonify({'error': str(error)}), 500
        if not data:
            return jsonify({'error': 'Oefening niet gevonden'}), 404
        # data may be a list
        result = data[0] if isinstance(data, list) and data else data
        return jsonify(result), 200
    else:
        oefening = next((oef for oef in oefeningen_cache if oef.get('id') == id), None)
        if oefening is None:
            return jsonify({'error': 'Oefening niet gevonden'}), 404
        return jsonify(oefening), 200

@routes_blueprint.route('/api/oefeningen', methods=['POST'])
def create_oefening():
    try:
        data = request.get_json()
        # Basic validation: titel and doelgroep required
        if not data or 'titel' not in data or 'doelgroep' not in data:
            return jsonify({'error': 'Missende vereiste velden: titel en doelgroep'}), 400

        # Normalize fields
        payload = {
            'titel': data.get('titel'),
            'doelgroep': data.get('doelgroep'),
            'duur': data.get('duur'),
            'categorie': data.get('categorie'),
            'topics': data.get('topics') or data.get('topic') or [],
            'positions': data.get('positions') or [],
            'teaching_points': data.get('teaching_points') or data.get('teaching_point') or [],
            'beschrijving': data.get('beschrijving') or data.get('uitleg') or '',
            'diagram': data.get('diagram') or [],
        }

        if use_supabase and supabase:
            resp = supabase.table('oefeningen').insert(payload).execute()
            data_resp, error = _normalize_supabase_response(resp)
            if error:
                logging.error('Supabase insert error: %s', error)
                return jsonify({'error': str(error)}), 500
            inserted = data_resp[0] if isinstance(data_resp, list) and data_resp else data_resp
            return jsonify({'message': 'Oefening toegevoegd', 'oefening': inserted}), 201
        else:
            # fallback in-memory
            new_id = (oefeningen_cache[-1].get('id') if oefeningen_cache else 0) + 1
            payload['id'] = new_id
            oefeningen_cache.append(payload)
            return jsonify({'message': 'Oefening toegevoegd', 'id': new_id}), 201

    except Exception as e:
        logging.exception('Error creating oefening')
        return jsonify({'error': str(e)}), 500

@routes_blueprint.route('/api/oefeningen/<int:id>', methods=['PUT'])
def update_oefening(id):
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Geen data verstrekt'}), 400

        # Normalize incoming update data
        update_fields = {}
        for key in ['titel', 'doelgroep', 'duur', 'categorie', 'topics', 'positions', 'teaching_points', 'beschrijving', 'diagram']:
            if key in data:
                update_fields[key] = data[key]

        if use_supabase and supabase:
            resp = supabase.table('oefeningen').update(update_fields).eq('id', id).execute()
            data_resp, error = _normalize_supabase_response(resp)
            if error:
                logging.error('Supabase update error: %s', error)
                return jsonify({'error': str(error)}), 500
            updated = data_resp[0] if isinstance(data_resp, list) and data_resp else data_resp
            return jsonify({'message': 'Oefening bijgewerkt', 'oefening': updated}), 200
        else:
            for idx, oef in enumerate(oefeningen_cache):
                if oef.get('id') == id:
                    oef.update(update_fields)
                    return jsonify({'message': 'Oefening bijgewerkt', 'oefening': oef}), 200
            return jsonify({'error': 'Oefening niet gevonden'}), 404

    except Exception as e:
        logging.exception('Error updating oefening')
        return jsonify({'error': str(e)}), 500

@routes_blueprint.route('/api/oefeningen/<int:id>', methods=['DELETE'])
def delete_oefening(id):
    try:
        if use_supabase and supabase:
            resp = supabase.table('oefeningen').delete().eq('id', id).execute()
            data_resp, error = _normalize_supabase_response(resp)
            if error:
                logging.error('Supabase delete error: %s', error)
                return jsonify({'error': str(error)}), 500
            return jsonify({'message': 'Oefening verwijderd'}), 200
        else:
            for idx, oef in enumerate(oefeningen_cache):
                if oef.get('id') == id:
                    oefeningen_cache.pop(idx)
                    return jsonify({'message': 'Oefening verwijderd'}), 200
            return jsonify({'error': 'Oefening niet gevonden'}), 404
    except Exception as e:
        logging.exception('Error deleting oefening')
        return jsonify({'error': str(e)}), 500