import { createClient } from "redis";

const cache= createClient({
    url: "redis://localhost:6379"
});

cache.on("error",(err)=>{
    console.log("valkey error: ",err);
})

async function initCache() {
  await cache.connect();
}
initCache();

export default cache;
