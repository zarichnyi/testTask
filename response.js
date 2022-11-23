exports.status = (status, values, response) => {
    const data = {
        status: status,
        response_value: values
    }

    response.status(data.status);
    response.json(data);
    response.end();
}