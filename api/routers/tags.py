from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict

tag = APIRouter(prefix='/api/data', tags=['Tags Data'])

#tag_list = { }
tag_list: Dict[int, dict] = { }

class tagCreate(BaseModel):
    tagName: str

class delRequest(BaseModel):
    keys: List[int]

class subTagCreate(BaseModel):
    subTagName: str

class delSubRequest(BaseModel):
    subTags: List[str]

# Tested!
@tag.get('/tag_list')
def testing_data() :
    return tag_list

@tag.post('/tags')
def add_tag(tag: tagCreate):
    new_tag = tag.tagName.strip()
    if not new_tag:
        raise HTTPException(status_code=400, detail="Cannot be empty")

    next_index = max(tag_list.keys()) + 1 if tag_list else 0
    tag_list[next_index] = {'name': new_tag, 'sub-tags': []} 
    return {'index': next_index, 'tag': new_tag}

@tag.delete('/tag_delete')
def del_tag(request: delRequest):
    global tag_list

    for key in request.keys:
        if key in tag_list:
            del tag_list[key]
    return {'message': f"{len(request.keys)} deleted!"}

#==== Sub-Tags ====#
@tag.post('/tags/{tag_id}/subtags')
def add_sub_tag(tag_id: int, sub_tag: subTagCreate):
    if tag_id not in tag_list:
        raise HTTPException(status_code=404, detail='Cannot find main tag')
    new_sub = sub_tag.subTagName.strip()
    if not new_sub:
        raise HTTPException(status_code=400, detail='Cannot be empty')
    if new_sub in tag_list[tag_id]['sub-tags']:
        raise HTTPException(status_code=400, detail='The sub-tag had already been made')

    tag_list[tag_id]['sub-tags'].append(new_sub)
    return {'tag_id': tag_id, 'sub-tags': tag_list[tag_id]['sub-tags']}

@tag.delete('/tags/{tag_id}/subtags')
def del_sub_tag(tag_id:int, request: delSubRequest):
    if tag_id not in tag_list:
        raise HTTPException(status_code=404, detail='Cannot find main tag')
    tag_list[tag_id]['sub-tags'] = [s for s in tag_list[tag_id]['sub-tags'] if s not in request.subTags]
    return {'sub-tags': tag_list[tag_id]['sub-tags']}