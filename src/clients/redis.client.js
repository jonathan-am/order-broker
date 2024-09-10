let redis;

export const getUniqueValue = async (key) => {
    return await redis.get(`${key}`);
}

export const removeValue = async (key) => {
    return await redis.del(key);
}

export const insertValue = async (key, value) => {
    return await redis.set(key, value);
}

export const getAllValues = async (key) => {
    return await redis.hGetAll(key);
}

export const initRedis = (cluster) => {
    redis = cluster;
}

export default {
    getUniqueValue,
    getAllValues,
    removeValue,
    insertValue,
    initRedis
}