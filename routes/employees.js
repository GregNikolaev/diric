var express = require('express');
var router = express.Router();
const Config = require('../config');
const model = require('../models/employee');

const Sequelize = require('sequelize');

const db = new Sequelize(Config.DB.name, Config.DB.user, Config.DB.pass, Config.DB.opts);


function close(){
  console.warn('task is stopped');
  process.exit(0);
}

const error = (e) => console.error('\n  FATAL ERROR: ' + e.message + '\n')||close();

process.on('SIGINT', () => {
  close();
});

/**
 * @swagger
 * definitions:
 *   employee:
 *     properties:
 *       name:
 *         type: string
 *       soname:
 *         type: string
 *       position:
 *         type: string
 *       description:
 *         type: string
 */

/**
 * @swagger
 * definitions:
 *   position:
 *     properties:
 *       position:
 *         type: string
 */

/**
 * @swagger
 * /employees:
 *   get:
 *     tags:
 *       - Employees
 *     description: Returns all employees
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of employees
 *         schema:
 *           $ref: '#/definitions/employee'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Page not found
 *       500:
 *         description: Internal server error
 *       501:
 *         description: TypeError
 *       502:
 *         description: Service overloaded
 *       503:
 *         description: Bad gateway
 */
router.get('/', function(req, res, next) {
  db.query('SELECT * FROM employees')
    .then(data => {
      if(!data[0]) res.status(500).send('No data');
      res.send(data[0]);
    })
    .catch(e => error(e))
});
/**
 * @swagger
 * /employees/{id}:
 *   get:
 *     tags:
 *       - Employees
 *     description: Returns a single employee
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Employee's id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Employee
 *       400:
 *         description: Bad request
 *       404:
 *         description: Page not found
 *       500:
 *         description: Internal server error
 *       502:
 *         description: Service overloaded
 *       503:
 *         description: Bad gateway
 */
router.get('/:id', function(req, res, next) {
  let id = +req.params.id;
  if (typeof id !=='number') {
    res.status(500).send('Your id is invalid')
  }

  db.query('SELECT * FROM employees WHERE id = :id', {
    replacements: {id: id}
  })
    .then(data => {
      if(!data[0][0]) {res.status(500).send('Something wrong with id');
     }
      res.send(data[0][0]);

    })
    .catch(e => error(e))
});
/**
 * @swagger
 * /employees/{id}:
 *   delete:
 *     tags:
 *       - Employees
 *     description: Deletes a single employee
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Employee's id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Successfully deleted
 *       400:
 *         description: Bad request
 *       404:
 *         description: Page not found
 *       500:
 *         description: Internal server error
 *       502:
 *         description: Service overloaded
 *       503:
 *         description: Bad gateway
 */
router.delete('/:id', function(req, res, next) {
  let id = +req.params.id;
  if (typeof id !=='number') {
    res.status(500).send('Your id is invalid')
  }
  db.query('DELETE FROM employees WHERE id = :id', {
    replacements: {id: id}
  })
    .then(() => {
      res.send('This employee was discharged');
    })
    .catch(e => error(e))
});
/**
 * @swagger
 * /employees:
 *   post:
 *     tags:
 *       - Employees
 *     description: Creates a new employee
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: employee
 *         description: Employee object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/employee'
 *     responses:
 *       200:
 *         description: Successfully created
 *       400:
 *         description: Bad request
 *       404:
 *         description: Page not found
 *       500:
 *         description: Internal server error
 *       502:
 *         description: Service overloaded
 *       503:
 *         description: Bad gateway
 */
router.post('/', function(req, res, next) {
  let {name, soname, position, description} = req.body;
  if( typeof name !== 'string' ||typeof soname !== 'string' ||typeof position !== 'string' ||typeof description !== 'string') {
    console.error('invalid data type');
    res.status(500).send('Data type invalid');
  }
  db.query(`INSERT INTO employees (name, soname, position, description)
            VALUES (:name, :soname, :position, :description)`, {
    replacements: {name: name, soname: soname, position: position, description: description}
  })
   .then(() => {
      res.send('This employee was successfully hired');
    })
    .catch(e => error(e))
});
/**
 * @swagger
 * /employees/{id}:
 *   put:
 *     tags:
 *       - Employees
 *     description: Updates a single employee's position
 *     produces: application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Employee's id
 *         required: true
 *         type: integer
 *       - name: position
 *         in: body
 *         description: Employee's position
 *         required: true
 *         schema:
 *           type: string
 *           $ref: '#/definitions/position'
 *     responses:
 *       200:
 *         description: Successfully updated
 *       400:
 *         description: Bad request
 *       404:
 *         description: Page not found
 *       500:
 *         description: Internal server error
 *       502:
 *         description: Service overloaded
 *       503:
 *         description: Bad gateway
 */
router.put('/:id', function(req, res, next) {
  let {position} = req.body;
  if( typeof position !== 'string'){
    console.error('invalid data type');
    res.status(500).send('Data type invalid');
  }
  let id = +req.params.id;
  if (typeof id !=='number') {
    res.status(500).send('Your id is invalid')
  }
  db.query(`UPDATE employees
            SET position = :position WHERE id = :id`, {
    replacements: { position: position, id: id}
  })
    .then(() => {
      res.send('This employee changed his position');
    })
    .catch(e => error(e))
});

module.exports = router;
