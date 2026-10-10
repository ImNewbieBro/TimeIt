from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

tag = APIRouter(prefix='/api/data', tags=['Tags Data'])

tag_list = {

}

class TagCreate(BaseModel):
    tagName: str

# Tested!
@tag.get('/tag_list')
def testing_data() :
    return tag_list

@tag.post('/tags')
def add_tag(tag: TagCreate):
    new_tag = tag.tagName.strip()
    if not new_tag:
        raise HTTPException(status_code=400, detail="Cannot be empty")

    next_index = max(tag_list.keys()) + 1 if tag_list else 0
    tag_list[next_index] = new_tag 
    return {'index': next_index, 'tag': new_tag}

class delRequest(BaseModel):
    keys: List[int]

@tag.delete('/tag_delete')
def del_tag(request: delRequest):
    global tag_list

    for key in request.keys:
        if key in tag_list:
            del tag_list[key]
    return {'message': f"{len(request.keys)} deleted!"}