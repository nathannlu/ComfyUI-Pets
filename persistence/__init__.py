import os
import dbm
import uuid
from datetime import datetime

def set_user_id():
    if not os.path.exists("./.dat"):
        os.makedirs("./.dat")
    with dbm.open('./.dat/u', 'c') as db:
        if b'user_id' not in db:
            db[b'user_id'] = str(uuid.uuid4()).encode('utf-8')
            db[b'balance'] = str(0).encode('utf-8')

        db[b'last_login'] = datetime.now().isoformat().encode('utf-8')


def get_current_user():
    user = {}
    if not os.path.exists("./.dat"):
        os.makedirs("./.dat")
    with dbm.open('./.dat/u', 'c') as db:

        # Check if user exists
        if b'user_id' not in db:
            db[b'user_id'] = str(uuid.uuid4()).encode('utf-8')

        if b'balance' not in db:
            db[b'balance'] = str(0).encode('utf-8')

        db[b'last_login'] = datetime.now().isoformat().encode('utf-8')

        # return data
        for key in db.keys():
            user[key.decode('utf-8')] = db[key].decode('utf-8')

    return user

def update_balance(balance):
    with dbm.open('./.dat/u', 'w') as db:
        db[b'balance'] = str(balance).encode('utf-8')
