import {
    handleCors,
    handleHelmet,
    handleBodyReqParsing,
    handleCompression
} from './common';

import {
    handleAPIDocumentation
} from './apiDocs';

export default [handleCors, handleHelmet, handleBodyReqParsing, handleCompression, handleAPIDocumentation];