import uvicorn
import argparse
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import api

app = FastAPI(title="File Server")

app.include_router(api.file, prefix="/api/file")
app.include_router(api.folder, prefix="/api/folder")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]

)

app.mount("/fileserv", StaticFiles(directory=Path(__file__).parent.joinpath("www"), html=True))
app.mount("/den", StaticFiles(directory=Path(__file__).parent.joinpath("den"), html=True))


@app.get("/check")
def check():
    return {"running": True}


if __name__ == "__main__":

    import os
    os.system('')

    parser = argparse.ArgumentParser(prog="run.py", description="Start the server")
    parser.add_argument('-host', help="Server host. Defaults to 0.0.0.0", default="0.0.0.0")
    parser.add_argument('-p', type=int, help="Server port, Defaults to 2077", default=2077)
    parser.add_argument('-reload', help="Server reload for debug purposes",action='store_true')

    args = parser.parse_args()
    import uvicorn
    uvicorn.run(app="main:app", host=args.host, port=args.p, reload=args.reload, workers=2)