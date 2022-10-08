export default (id:string | undefined)=>{
    const regexMongoId = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i
    if(!id || !regexMongoId.test(id))
    throw new Error(`mongo id is invalid`)
    return id as string;
}