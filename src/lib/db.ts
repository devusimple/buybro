import schema from "@/instant.schema";
import { init } from "@instantdb/react";

const db = init({
    appId: import.meta.env.VITE_INSTANT_APP_ID,
    schema
})

export default db