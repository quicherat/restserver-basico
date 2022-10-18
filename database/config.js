import mongoose from 'mongoose';

const dbConnection = async() => {

    try {

        await mongoose.connect(process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: true,
            // useFindAndModify: false
        });

        console.log('DB online');
        
    } catch (error) {
        console.log(error)
        throw new Error('Error al iniciar DB');
    }



}

export {
    dbConnection
}