// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var proto_chat_pb = require('../proto/chat_pb.js');

function serialize_ClientRequest(arg) {
  if (!(arg instanceof proto_chat_pb.ClientRequest)) {
    throw new Error('Expected argument of type ClientRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ClientRequest(buffer_arg) {
  return proto_chat_pb.ClientRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ServerRequest(arg) {
  if (!(arg instanceof proto_chat_pb.ServerRequest)) {
    throw new Error('Expected argument of type ServerRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ServerRequest(buffer_arg) {
  return proto_chat_pb.ServerRequest.deserializeBinary(new Uint8Array(buffer_arg));
}


var ChatServiceService = exports.ChatServiceService = {
  chatRequest: {
    path: '/ChatService/chatRequest',
    requestStream: true,
    responseStream: true,
    requestType: proto_chat_pb.ClientRequest,
    responseType: proto_chat_pb.ServerRequest,
    requestSerialize: serialize_ClientRequest,
    requestDeserialize: deserialize_ClientRequest,
    responseSerialize: serialize_ServerRequest,
    responseDeserialize: deserialize_ServerRequest,
  },
};

exports.ChatServiceClient = grpc.makeGenericClientConstructor(ChatServiceService);
