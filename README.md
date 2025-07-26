CORS Errors
Cors ke errors backend pe resolve hote hain
Localhost me ho jaaye hain frontend pe, proxy laga ke -> but production me daalte hii fatega
setup kaise karein cors:
import cors from "cors";
app.use(
cors({
origin: "http://localhost:3000",
methods: ["GET", "POST", "DELETE", "OPTIONS"],
})
);
//cors related saari debuggging yehin se hogi
//we need to write configurations in it
//works perfectly in production, localhost me dhoka de jaati hai
