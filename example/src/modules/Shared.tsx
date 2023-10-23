import RNFS from 'react-native-fs'

async function deleteFile(name:string){
    const path = RNFS.DocumentDirectoryPath + '/'+ name;
    try {
       const exists = await RNFS.exists(path)
       if(exists){
           await   RNFS.unlink(path)
       }
    } catch (e:any) {
        console.warn('DeleteFile',e.message)
    }
    return path
}
async function createFile(name:string,content:string){
    const path = RNFS.DocumentDirectoryPath + '/'+ name;

    await deleteFile(name)
    try {
        await RNFS.writeFile(path, content, 'utf8')
    } catch (e:any) {
        console.warn('CreateFile',e.message)
    }
    return path
}
export {
    deleteFile,
    createFile
}
