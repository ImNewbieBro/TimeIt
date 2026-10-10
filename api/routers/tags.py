from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

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

@tag.delete('/{tag_id}')
def del_tag(tag_id: int):
    if tag_id not in tag_list:
        raise HTTPException(status_code=444, detail=f"Tag with index {tag_id} not found")

    deleted_tag = tag_list.pop(tag_id)
    return {"messages": f"{deleted_tag} deleted"}