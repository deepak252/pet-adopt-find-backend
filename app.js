const express = require('express');
const app = express();
const cors = require('cors');

require('./db');


app.use(express.json());
app.use(cors());

app.use(require("./routes/authRoute"));
app.use(require("./routes/petRoute"));
app.use(require("./routes/userRoute"));
app.use(require("./routes/adminRoute"));
app.use(require("./routes/requestRoute"));
const PORT = process.env.PORT || "8000";

 app.listen(PORT, () => {
    console.log("server is running on port ", PORT);
});