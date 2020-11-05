from flask_restx import Resource
from flask import request, make_response, jsonify, after_this_request
from bson.objectid import ObjectId
import hashlib
from flask_jwt import jwt_required, current_identity

from app import db_connection

# this api instance is to handle with all the recipes
class User(Resource):
    
    def post(self):
        '''
        user login function
        '''
        try:
            post_data = request.get_json()
            username = post_data.get('username', None)
            password = post_data.get('password', None)
            if not username or not password:
                return {'result':'Please enter your username and password'}, 401

            # fetch the stroed password
            collection = db_connection["users"]
            user_stored = collection.find_one({"username": username})
            if not user_stored:
                return {'result':'Invalide Credentials'}, 401
            pd_stored = user_stored['password']


            # we compute the md5 with user password
            md5_obj = hashlib.md5()
            md5_obj.update(password.encode('utf-8'))
            pd_md5 = md5_obj.hexdigest()
            # return unauthorizaed if password not matched
            if pd_stored != pd_md5:
                return {'result':'Invalide Credentials'}, 401

        except Exception as e:
            return {'result': str(e)}, 400

        @after_this_request
        def after_request(response):
            # and set the httponly cookie so that frontend
            # dont need to fetch it everytime
            response.set_cookie('Authorization', username, httponly=True)
            return response

        return {'result':{'username': username}}, 200


# this api instance is to handle with all the recipes
class UserLogout(Resource):
    
    @jwt_required()
    def post(self):
        '''
        user logout function
        '''

        # do nothing but remove Authorization in cookie
        @after_this_request
        def after_request(response):
            # and set the httponly cookie so that frontend
            # dont need to fetch it everytime
            response.set_cookie('Authorization', '', httponly=True)
            return response

        return {'result':{'username': 'success'}}, 200