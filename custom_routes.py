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


