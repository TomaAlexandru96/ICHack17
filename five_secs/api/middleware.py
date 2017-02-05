class MyMiddleware:
    def process_response(self, request, response):
        response['Content-Disposition'] = "inline"
        return response
