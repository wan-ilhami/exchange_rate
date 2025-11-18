const request = require('supertest');
const express = require('express');
const app = require('../src/app'); // adjust path if needed

describe('App routes and middleware', () => {
    it('should respond to /health with status 200', async () => {
        const res = await request(app).get('/health');

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Server is running');
        expect(new Date(res.body.timestamp).toString()).not.toBe('Invalid Date');
    });

    it('should log requests (middleware)', async () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
        await request(app).get('/health');
        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringMatching(/ - GET \/health/)
        );
        consoleSpy.mockRestore();
    });

    it('should handle unknown routes via errorHandler', async () => {
        const res = await request(app).get('/unknown-route');
        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.error).toBe('Not Found');
        expect(res.body.details).toBeDefined();
    });

});
