import authRoutes from './auth';
import userRoutes from './user';
import postRoutes from './post';
import subforumRoutes from './subforum';

export default [...authRoutes, ...postRoutes, ...userRoutes, ...subforumRoutes];