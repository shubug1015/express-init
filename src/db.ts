import mongoose, { ConnectOptions, Error } from 'mongoose';

mongoose.connect(
  process.env.DB_URL as string,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  } as ConnectOptions
);

const db = mongoose.connection;

const handleOpen = () => console.log('Connected to DB');
const handleError = (error: Error) => console.log('DB Error', error);

db.on('error', handleError);
db.once('open', handleOpen);
