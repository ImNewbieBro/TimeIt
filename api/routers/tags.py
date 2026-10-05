from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

tag = APIRouter(prefix='/api/data', tags=['Tags Data'])

test_data = {
    0: 'Study',
    1: 'Hobby',
    2: 'Others'
}

class TagCreate(BaseModel):
    name: str

@tag.get('/tag')
def testing_data() :
    return test_data

@tag.post('/tags')
def add_tag(tag: TagCreate):
    new_tag = tag.name.strip()
    if not new_tag:
        raise HTTPException(status_code=400, detail="Cannot be empty")

    next_index = max(test_data.keys()) + 1 if test_data else 1
    test_data[next_index] = new_tag
    return {'index': next_index, 'tag': new_tag}

@tag.delete('/{tag_id}')
def del_tag(tag_id: int):
    if tag_id not in test_data:
        raise HTTPException(status_code=444, detail=f"Tag with index {tag_id} not found")

    deleted_tag = test_data.pop(tag_id)
    return {"messages": f"{deleted_tag} deleted"}