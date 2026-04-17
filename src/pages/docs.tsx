import 'swagger-ui-react/swagger-ui.css';
import SwaggerUI from 'swagger-ui-react';

export default function ApiDocs() {
    return (
        <SwaggerUI url="/openapi.yaml" />
    );
}
