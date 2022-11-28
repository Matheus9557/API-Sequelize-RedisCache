const { response } = require('express');

const Pessoa = require('../models/pessoa');
const client = require('../database/redis');

const buscarPessoa = async (request, response) =>{
    const email = request.params.email;

    const resultado = await client.get(email);

    if(resultado!=null){
        const pessoa = JSON.parse(resultado);
        response.status(200).send(pessoa);
    }else{
        const pessoa = await Pessoa.findOne({where:{
        email:email
    }});

    if(pessoa == null){
        response.status(200).send('Usuário não encontrado');
    }else{
        client.set(email, JSON.stringify(pessoa), {EX: 3600});
        response.status(200).send(pessoa);
    }

};
    }


const getPessoas = async (request, response)=>{
    const pessoas = await Pessoa.findAll();
    response.status(200).send(pessoas);
};

const addPessoa = async (request, response) =>{
    const pessoa = Pessoa.build(request.body);
    pessoa.save().then(()=>{
        response.status(200).send('Usuário criado!');
    }).catch(err =>{
        response.status(400).send('Falha ao salvar');
    });

};

const deletarPessoa = async (request, response)=>{
    const email = request.params.email;

    Pessoa.destroy({
        where: {
            email: email
        }
    }).then(result=>{
        if(result>0){
            response.status(200).send('Usuário removido');
        }else{
            response.status(200).send('Usuário não encontrado');
        }
    }).catch(err=>{
        response.status(400).send('Falha ao remover');
    });

};

const atualizarPessoa = async(request, response)=>{
    
    Pessoa.update({
        nome: request.body.nome},
            {
                where: {
                    email: request.body.email
            }
        }
    ).then(result=>{
        if(result>0){
            response.status(200).send('Usuário atualizado');
        }else{
            response.status(200).send('Usuário não encontrado');
        }
    }).catch(err=>{
        console.log(err);
        response.status(400).send('Falha ao atualizar');
    });

}

const sincronizar = async(request, response) =>{
    await Pessoa.sync();
    response.status(200).send('Sincronizado');
}

module.exports = {getPessoas, addPessoa, sincronizar, deletarPessoa, atualizarPessoa, buscarPessoa};