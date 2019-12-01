import Unicap from '../controllers/unicap.controller';

export default {
    Query: {
        test: (_) => Unicap.index(),
    },
}