function isFinish(url){
    if(confirm('한 번 마감하면 되돌릴 수 없습니다. 계속하시겠습니까?')){
        location.href=url
    }
}

function isDelete(url){
    if(confirm('한 번 삭제하면 되돌릴 수 없습니다. 계속하시겠습니까?')){
        location.href=url
    }
}
