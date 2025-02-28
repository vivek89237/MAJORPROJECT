import { v4 as uuidv4 } from 'uuid';

export function getUID(){
    const uid = uuidv4();
    return uid;
}