import os
import dbm
import uuid
from datetime import datetime

current_dir = os.path.dirname(os.path.abspath(__file__))
data_path = os.path.join(current_dir, ".dat")
u_path = os.path.join(data_path, "u")
p_path = os.path.join(data_path, "p")

def set_user_id():
    if not os.path.exists(data_path):
        os.makedirs(data_path)
    with dbm.open(u_path, 'c') as db:
        if b'user_id' not in db:
            db[b'user_id'] = str(uuid.uuid4()).encode('utf-8')
            db[b'balance'] = str(0).encode('utf-8')

        db[b'last_login'] = datetime.now().isoformat().encode('utf-8')


def get_current_user():
    user = {}
    if not os.path.exists(data_path):
        os.makedirs(data_path)
    with dbm.open(u_path, 'c') as db:

        # Check if user exists
        if b'user_id' not in db:
            db[b'user_id'] = str(uuid.uuid4()).encode('utf-8')

        if b'balance' not in db:
            db[b'balance'] = str(0).encode('utf-8')

        if b'inventory' not in db:
            # Initialize an empty inventory
            db[b'inventory'] = str({}).encode('utf-8')

        db[b'last_login'] = datetime.now().isoformat().encode('utf-8')

        # return data
        for key in db.keys():
            user[key.decode('utf-8')] = db[key].decode('utf-8')

    return user

def update_balance(balance):
    with dbm.open(u_path, 'w') as db:
        db[b'balance'] = str(balance).encode('utf-8')

def update_inventory(inventory):
    with dbm.open(u_path, 'w') as db:
        db[b'inventory'] = str(inventory).encode('utf-8')

def update_pet_age(age):
    with dbm.open(p_path, 'w') as db:
        db[b'age'] = str(age).encode('utf-8')
def update_pet_food_consumed(amount):
    with dbm.open(p_path, 'w') as db:
        db[b'hunger_level'] = str(amount).encode('utf-8')

def get_current_pet():
    pet = {}
    if not os.path.exists(data_path):
        os.makedirs(data_path)
    with dbm.open(p_path, 'c') as db:
        # Check if user exists
        if b'age' not in db:
            db[b'age'] = str(0).encode('utf-8')
            db[b'hunger_level'] = str(0).encode('utf-8')

        # return data
        for key in db.keys():
            pet[key.decode('utf-8')] = db[key].decode('utf-8')

    return pet

