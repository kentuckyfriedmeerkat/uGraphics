// Import the Express module
import * as Express from 'express';
import * as Shell from 'shelljs';
import * as _ from 'lodash';
import * as Path from 'path';

// Create an Express router
let router = Express.Router();

// Serve Pug dashboard templates
router.get('/templates/:id', (req, res) =>
    res.render(`dash/templates/${req.params.id}`, {
        Shell: Shell,
        _: _,
        Path: Path
    }));

// For all other requests to this router, just render the index template
router.get('/*', (req, res) => res.render('dash/index'));

// Export the router object as the default export of the module
export default router;
