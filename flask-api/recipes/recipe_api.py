from flask_restx import Resource
from flask import request
from bson.objectid import ObjectId

from app import db_connection

# this api instance is to handle with all the recipes
class Recipes(Resource):
    
    def get(self):
        '''
        Retrieve all the recipe id and title for list displaying
        '''

        # example curl localhost:5000/v1/recipes/
        try:
            collection = db_connection["group3_collection"]
            # for now just return the 8 recipe in total
            # to keep minimun only return the id and title of list
            cursor = collection.find()
            recipes = []
            for x in cursor:
                # for displaying pick the first instruction
                description = x['instructions'][0]['description'] if len(x['instructions']) > 0 else ''
                # some of the instruction are over length so pick first 20 word if greater
                description = description[:50] if len(description) > 50 else description

                recipes.append({
                    'id': str(x['_id']), 
                    'title': x['title'], 
                    'description': description + ' ...',
                    'image': x.get('mediaURL').get('url', None)
                })

        except Exception as e:
            return {'result': str(e)}, 400

        return {'result':recipes}, 200



# this api instance deal with the specific recipe
# the recipe is target by rid
class Recipe(Resource):
    
    def get(self, rid):
        '''
        Retrieve the recipe detail by id
        '''

        # example curl localhost:5000/v1/recipes/5f8c67b8708d83b9867302b6

        try:
            collection = db_connection["group3_collection"]
            # for now just return the 8 recipe in total
            # to keep minimun only return the id and title of list
            recipe = collection.find_one(ObjectId(rid))

            # change the id to string
            recipe['_id'] = str(recipe['_id'])
        except Exception as e:
            return {'result': str(e)}, 400

        return {'result':recipe}, 200



class RecipeQuery(Resource):
    
    def post(self):
        '''
        Retrieve the recipe detail by input attribute
        for now it is only query by title
        '''

        # example curl -v -XPOST -H "Content-type: application/json" -d '{"title":"Fruit and Nut Oat Bowl"}' 'localhost:5000/v1/recipes/query'

        try:
            # first get the title from the payload
            post_data = request.get_json()
            title = post_data.get('title', None)
            if not title:
                return {'result':'Please input the title'}, 403

            collection = db_connection["group3_collection"]
            # for now just return the 8 recipe in total
            # to keep minimun only return the id and title of list
            recipe = collection.find_one({'title': title})

            # change the id to string if we find it
            if recipe:
                recipe['_id'] = str(recipe['_id'])
        except Exception as e:
            return {'result': str(e)}, 400

        return {'result':recipe}, 200


# this api instance is make random number of recipe for front page
class RecipesRadom(Resource):
    
    def get(self):
        '''
        Retrieve random number the recipe and title for list displaying
        '''
        # set the default random size as 3
        random_number = request.args.get('size', 3)

        # example curl localhost:5000/v1/recipes/
        try:
            collection = db_connection["group3_collection"]
            # for now just return the 8 recipe in total
            # to keep minimun only return the id and title of list
            cursor = collection.aggregate([{ '$sample': { 'size': random_number } }])
            recipes = []
            for x in cursor:
                # for displaying pick the first instruction
                description = x['instructions'][0]['description'] if len(x['instructions']) > 0 else ''
                # some of the instruction are over length so pick first 20 word if greater
                description = description[:50] if len(description) > 50 else description
                
                recipes.append({
                    'id': str(x['_id']), 
                    'title': x['title'], 
                    'description': description + ' ...',
                    'image': x.get('mediaURL').get('url', None)
                })

        except Exception as e:
            return {'result': str(e)}, 400

        return {'result':recipes}, 200