import server
from . import persistence
from aiohttp import web

@server.PromptServer.instance.routes.get("/comfy-pets/user")
async def comfy_pets_get_user(request):
    try:
        data = persistence.get_current_user()
        return web.json_response({
            "user": data
        }, content_type='application/json')
    except Exception as e:
        print("Error:", e)
        return web.json_response({ "error": e }, status=400)

@server.PromptServer.instance.routes.post("/comfy-pets/balance")
async def comfy_pets_update_balance(request):
    try:
        data = await request.json()
        balance = data.get("balance")

        persistence.update_balance(balance)

        return web.json_response({
            "message": "Balance updated successfully"
        }, content_type='application/json')

    except Exception as e:
        print("Error:", e)
        return web.json_response({ "error": str(e) }, status=400)


@server.PromptServer.instance.routes.post("/comfy-pets/inventory")
async def comfy_pets_update_inventory(request):
    try:
        data = await request.json()
        inventory = data.get("inventory")

        persistence.update_inventory(inventory)

        return web.json_response({
            "message": "Inventory updated successfully"
        }, content_type='application/json')

    except Exception as e:
        print("Error:", e)
        return web.json_response({ "error": str(e) }, status=400)

