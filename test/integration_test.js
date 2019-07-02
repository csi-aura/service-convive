/*
 #  Project: chaise                                                            #
 #  File: \tests\unit_test.js                                                  #
 #                                                                             #
 #  Author: Sylvain (contact@cashsystemes.eu)                                  #
 #  Modified By: Sylvain (contact@cashsystemes.eu>)                            #
 #                                                                             #
 #  File Created: Monday, 24th June 2019 10:45:20 am                           #
 #  Last Modified: Friday, 28th June 2019 9:49:48 am                           #
 #                                                                             #
 #  Copyright 2018 - 2019, Cash Systemes Industries                            #
 */

let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
chai.use(chaiHttp);

console.log(process.env)


// REGEX for ip in string
let r = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/

let app_name = process.env.APP_NAME || 'chaise'
let app_ingress_ip = process.env.HUDSON_URL.match(r)[0] || '192.168.30.244';
let app_env = process.env.KUBE_ENVIRONMENT || 'jx-staging'

let server = `http://${app_name}.${app_env}.${app_ingress_ip}.nip.io`




describe('Waiting mongoDb connexion', () => {
    before(done => require('readyness').doWhen(done));
    it('MongoDb is ready', () => true);
});


/*
 * Test the API
 */
describe('/GET flush', () => {

    it('it should flush the list', done => {
        chai.request(server)
            .get('/flush')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('result').eql([]);
                res.body.should.have.property('message').eql('0 convive(s).');
                done();
            });
    });





    it('it should POST a convive', (done) => {
        let book = {
            nom: "Sylvain",
            prenom: "Pip"
        }
        chai.request(server)
            .post('/add')
            .send(book)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('result').eql(1);
                res.body.should.have.property('message').eql("Le client Sylvain Pip à bien été ajouté.");
                done();
            });
    });





    it('it should GET the not empty list', (done) => {
        chai.request(server)
            .get('/list')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('result');
                res.body.result[0].should.have.property('nom').eql("Sylvain");
                res.body.result[0].should.have.property('prenom').eql("Pip");
                res.body.should.have.property('message').eql('1 convive(s).');
                done();
            });
    });
});