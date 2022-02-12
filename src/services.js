/* const { response } = require('express'); */

const nodemailer = require('nodemailer');
const res = require('express/lib/response');
const database = require('./database');

const responseModel = {
    success: false,
    results: [],
    error  : []
}

module.exports = {

    //Teste aplicação    
    aplicacao(req, res) {
        const response  = {... responseModel}

        response.data    = 'Aplicação funcionando!'
        response.success = true;

        return res.json(response);
    },

    //Obtém todas as Atividades
    async atividades(req, res) {
        const response  = {... responseModel}

        const data    = await database.query(`SELECT * FROM atividade ORDER BY nome`);
        const results = data[0];
        response.results = results;
        response.success = results.length > 0;

        return res.json(response);
    },

    //Obtém a taxa conforme faturamento informado
    async taxas(req, res) {
        const response    = {... responseModel};
        const faturamento = parseFloat(req.params.fat);
       
        if (isNaN(faturamento)) {
            response.error = [{ message: 'Faturamento inválido' }];
        } else {
            const planoResults = await database.query(`SELECT * FROM plano`);
            const planos = planoResults[0];
            let planoSelecionado = { id: 4 };

            if (faturamento <= 100000)  {
                for (let plano of planos) {
                    if (faturamento >= plano.valor_inicio && faturamento <= plano.valor_fim) {
                        planoSelecionado = plano;
                        break;
                    }
                }    
            }

            const taxaResults = await database.query(`SELECT * FROM taxa WHERE id_plano = ?`, planoSelecionado.id);
            let taxas = taxaResults[0] || [];

            taxas.forEach((e) => {
                e.visa_master = e.visa_master.toString().replace('.', ',') + "%";
                e.elo_demais  = e.elo_demais.toString().replace('.', ',') + "%";
            })

            planoSelecionado.taxas = taxas;

            response.results = planoSelecionado;
            response.success = planoSelecionado.taxas.length > 0;

            //Grava a consulta realizada
            const sql = 'INSERT INTO log_consulta (data, valor) VALUES (?,?)';
            const values = [new Date(), faturamento];
    
            await database.query(sql, values);
        }

        return res.json(response);
    },

    async contato(req, res)  {
        const response = {... responseModel};

        const nome     = req.body.nome;
        const telefone = req.body.telefone;
        let error      = false;

        if (!nome) {
            response.error = [{ message: 'Informe o nome' }];
            error = true;
        }
        if (!telefone) {
            response.error = [{ message: 'Informe o telefone' }];
            error = true;
        }

        if (!error) {
            const results  = await database.query(`SELECT * FROM contato WHERE nome = ?`, nome);
            const contatos = results[0];

            if (contatos.length === 0)  {
                const sql = 'INSERT INTO contato (nome, telefone, data) VALUES (?,?,?)';
                const values = [nome, telefone, new Date()];

                await database.query(sql, values);
            }
            const contato = { nome: nome, telefone: telefone };
            response.success = true;
            response.results = [contato];
            //this.sendMail(contato);
        }

        return res.json(response);
    },

    async sendMail(contato) {

        let body = '<p><h2>Simulador de Taxas</h2></p>';
        body += '<br/>'
        body += `<p><h3>Nome: ${contato.nome}</h3></p>`
        body += `<p><h3>Telefone: ${contato.telefone}</h3></p>`
      
        const transporter = nodemailer.createTransport({
            host: 'smtp.umbler.com',
            port: 587,
            auth: { user: '', pass: '' }
        });

        transporter.sendMail({
            from: '',
            to: 'wafbravin@gmail.com',
            subject: 'Contato Simulador de Taxas',
            html: body            
        }).then(res => {

        }).catch(error => {

        });
    } 
}