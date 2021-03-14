import { OpenApiV3Object } from './src/models/open-api-v3-object.model';

export const swaggerDoc: OpenApiV3Object = {
  openapi: '3.0.1',
  info: {
    description: '<h3 align="center">A REST Api written in Typescript using\nExpress</h3> <p align="center">Provides JWT Bearer Token authentication\nwith  access control lists<br> Protected routes will need a `jwt-token`<br>\nFull repo on [github](https://github.com/Netherium/neth-express-api-ts)<br>\nMade with ❤ by [Netherium](https://github.com/Netherium)</p>',
    contact: {
      email: 'gerpis@gmail.com'
    },
    license: {
      name: 'MIT license',
      url: 'https://opensource.org/licenses/MIT'
    },
    version: '0.3.0'
  },
  tags: [
    {
      name: 'Auth',
      description: 'Operations for authorizing'
    },
    {
      name: 'Users'
    },
    {
      name: 'Roles'
    },
    {
      name: 'ResourcePermissions'
    },
    {
      name: 'MediaObjects'
    },
    {
      name: 'Books'
    }
  ],
  paths: {
    '/auth/login': {
      post: {
        tags: [
          'Auth'
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AuthUser'
              }
            }
          },
          required: true
        },
        responses: {
          201: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Token'
                }
              }
            }
          },
          401: {
            $ref: '#/components/responses/HTTP_UNAUTHORIZED'
          },
          500: {
            $ref: '#/components/responses/HTTP_INTERNAL_SERVER_ERROR'
          }
        }
      }
    },
    '/auth/register': {
      post: {
        tags: [
          'Auth'
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AuthUser'
              }
            }
          },
          required: true
        },
        responses: {
          201: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/User'
                }
              }
            }
          },
          500: {
            $ref: '#/components/responses/HTTP_INTERNAL_SERVER_ERROR'
          }
        }
      }
    },
    '/auth/profile': {
      get: {
        tags: [
          'Auth'
        ],
        responses: {
          200: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/User'
                }
              }
            }
          },
          500: {
            $ref: '#/components/responses/HTTP_INTERNAL_SERVER_ERROR'
          }
        },
        security: [
          {
            Bearer: []
          }
        ]
      },
      put: {
        tags: [
          'Auth'
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AuthUser'
              }
            }
          },
          required: true
        },
        responses: {
          200: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/User'
                }
              }
            }
          },
          500: {
            $ref: '#/components/responses/HTTP_INTERNAL_SERVER_ERROR'
          }
        },
        security: [
          {
            Bearer: []
          }
        ]
      },
      delete: {
        tags: [
          'Auth'
        ],
        responses: {
          204: {
            $ref: '#/components/responses/HTTP_NO_CONTENT'
          },
          404: {
            $ref: '#/components/responses/HTTP_NOT_FOUND'
          },
          500: {
            $ref: '#/components/responses/HTTP_INTERNAL_SERVER_ERROR'
          }
        },
        security: [
          {
            Bearer: []
          }
        ]
      }
    },
    '/auth/init': {
      get: {
        tags: [
          'Auth'
        ],
        responses: {
          201: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Token'
                }
              }
            }
          },
          404: {
            $ref: '#/components/responses/HTTP_NOT_FOUND'
          },
          500: {
            $ref: '#/components/responses/HTTP_INTERNAL_SERVER_ERROR'
          }
        }
      }
    },
    '/users': {
      get: {
        tags: [
          'Users'
        ],
        parameters: [
          {
            $ref: '#/components/parameters/q'
          },
          {
            $ref: '#/components/parameters/_sort'
          },
          {
            $ref: '#/components/parameters/_limit'
          },
          {
            $ref: '#/components/parameters/_page'
          },
          {
            $ref: '#/components/parameters/paramsFilter'
          }
        ],
        responses: {
          200: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UserCollection'
                }
              }
            }
          },
          500: {
            $ref: '#/components/responses/HTTP_INTERNAL_SERVER_ERROR'
          }
        },
        security: [
          {
            Bearer: []
          }
        ]
      },
      post: {
        tags: [
          'Users'
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/User'
              }
            }
          }
        },
        responses: {
          200: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/User'
                }
              }
            }
          },
          404: {
            $ref: '#/components/responses/HTTP_NOT_FOUND'
          },
          500: {
            $ref: '#/components/responses/HTTP_INTERNAL_SERVER_ERROR'
          }
        },
        security: [
          {
            Bearer: []
          }
        ]
      }
    },
    '/users/{id}': {
      get: {
        tags: [
          'Users'
        ],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          200: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/User'
                }
              }
            }
          },
          404: {
            $ref: '#/components/responses/HTTP_NOT_FOUND'
          },
          500: {
            $ref: '#/components/responses/HTTP_INTERNAL_SERVER_ERROR'
          }
        },
        security: [
          {
            Bearer: []
          }
        ]
      },
      put: {
        tags: [
          'Users'
        ],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/User'
              }
            }
          }
        },
        responses: {
          200: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/User'
                }
              }
            }
          },
          404: {
            $ref: '#/components/responses/HTTP_NOT_FOUND'
          },
          500: {
            $ref: '#/components/responses/HTTP_INTERNAL_SERVER_ERROR'
          }
        },
        security: [
          {
            Bearer: []
          }
        ]
      },
      delete: {
        tags: [
          'Users'
        ],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          204: {
            $ref: '#/components/responses/HTTP_NO_CONTENT'
          },
          404: {
            $ref: '#/components/responses/HTTP_NOT_FOUND'
          },
          500: {
            $ref: '#/components/responses/HTTP_INTERNAL_SERVER_ERROR'
          }
        },
        security: [
          {
            Bearer: []
          }
        ]
      }
    },
    '/roles': {
      get: {
        tags: [
          'Roles'
        ],
        parameters: [
          {
            $ref: '#/components/parameters/q'
          },
          {
            $ref: '#/components/parameters/_sort'
          },
          {
            $ref: '#/components/parameters/_limit'
          },
          {
            $ref: '#/components/parameters/_page'
          },
          {
            $ref: '#/components/parameters/paramsFilter'
          }
        ],
        responses: {
          200: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/RoleCollection'
                }
              }
            }
          },
          500: {
            $ref: '#/components/responses/HTTP_INTERNAL_SERVER_ERROR'
          }
        },
        security: [
          {
            Bearer: []
          }
        ]
      },
      post: {
        tags: [
          'Roles'
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Role'
              }
            }
          }
        },
        responses: {
          200: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Role'
                }
              }
            }
          },
          404: {
            $ref: '#/components/responses/HTTP_NOT_FOUND'
          },
          500: {
            $ref: '#/components/responses/HTTP_INTERNAL_SERVER_ERROR'
          }
        },
        security: [
          {
            Bearer: []
          }
        ]
      }
    },
    '/roles/{id}': {
      get: {
        tags: [
          'Roles'
        ],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          200: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Role'
                }
              }
            }
          },
          404: {
            $ref: '#/components/responses/HTTP_NOT_FOUND'
          },
          500: {
            $ref: '#/components/responses/HTTP_INTERNAL_SERVER_ERROR'
          }
        },
        security: [
          {
            Bearer: []
          }
        ]
      },
      put: {
        tags: [
          'Roles'
        ],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Role'
              }
            }
          }
        },
        responses: {
          200: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Role'
                }
              }
            }
          },
          404: {
            $ref: '#/components/responses/HTTP_NOT_FOUND'
          },
          500: {
            $ref: '#/components/responses/HTTP_INTERNAL_SERVER_ERROR'
          }
        },
        security: [
          {
            Bearer: []
          }
        ]
      },
      delete: {
        tags: [
          'Roles'
        ],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          204: {
            $ref: '#/components/responses/HTTP_NO_CONTENT'
          },
          404: {
            $ref: '#/components/responses/HTTP_NOT_FOUND'
          },
          500: {
            $ref: '#/components/responses/HTTP_INTERNAL_SERVER_ERROR'
          }
        },
        security: [
          {
            Bearer: []
          }
        ]
      }
    },
    '/resource-permissions': {
      get: {
        tags: [
          'ResourcePermissions'
        ],
        parameters: [
          {
            $ref: '#/components/parameters/q'
          },
          {
            $ref: '#/components/parameters/_sort'
          },
          {
            $ref: '#/components/parameters/_limit'
          },
          {
            $ref: '#/components/parameters/_page'
          },
          {
            $ref: '#/components/parameters/paramsFilter'
          }
        ],
        responses: {
          200: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ResourcePermissionCollection'
                }
              }
            }
          },
          500: {
            $ref: '#/components/responses/HTTP_INTERNAL_SERVER_ERROR'
          }
        },
        security: [
          {
            Bearer: []
          }
        ]
      },
      post: {
        tags: [
          'ResourcePermissions'
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ResourcePermission'
              }
            }
          }
        },
        responses: {
          200: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ResourcePermission'
                }
              }
            }
          },
          404: {
            $ref: '#/components/responses/HTTP_NOT_FOUND'
          },
          500: {
            $ref: '#/components/responses/HTTP_INTERNAL_SERVER_ERROR'
          }
        },
        security: [
          {
            Bearer: []
          }
        ]
      }
    },
    '/resource-permissions/{id}': {
      get: {
        tags: [
          'ResourcePermissions'
        ],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          200: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ResourcePermission'
                }
              }
            }
          },
          404: {
            $ref: '#/components/responses/HTTP_NOT_FOUND'
          },
          500: {
            $ref: '#/components/responses/HTTP_INTERNAL_SERVER_ERROR'
          }
        },
        security: [
          {
            Bearer: []
          }
        ]
      },
      put: {
        tags: [
          'ResourcePermissions'
        ],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ResourcePermission'
              }
            }
          }
        },
        responses: {
          200: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ResourcePermission'
                }
              }
            }
          },
          404: {
            $ref: '#/components/responses/HTTP_NOT_FOUND'
          },
          500: {
            $ref: '#/components/responses/HTTP_INTERNAL_SERVER_ERROR'
          }
        },
        security: [
          {
            Bearer: []
          }
        ]
      },
      delete: {
        tags: [
          'ResourcePermissions'
        ],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          204: {
            $ref: '#/components/responses/HTTP_NO_CONTENT'
          },
          404: {
            $ref: '#/components/responses/HTTP_NOT_FOUND'
          },
          500: {
            $ref: '#/components/responses/HTTP_INTERNAL_SERVER_ERROR'
          }
        },
        security: [
          {
            Bearer: []
          }
        ]
      }
    },
    '/media-objects': {
      get: {
        tags: [
          'MediaObjects'
        ],
        parameters: [
          {
            $ref: '#/components/parameters/q'
          },
          {
            $ref: '#/components/parameters/_sort'
          },
          {
            $ref: '#/components/parameters/_limit'
          },
          {
            $ref: '#/components/parameters/_page'
          },
          {
            $ref: '#/components/parameters/paramsFilter'
          }
        ],
        responses: {
          200: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/MediaObjectCollection'
                }
              }
            }
          },
          500: {
            $ref: '#/components/responses/HTTP_INTERNAL_SERVER_ERROR'
          }
        },
        security: [
          {
            Bearer: []
          }
        ]
      },
      post: {
        tags: [
          'MediaObjects'
        ],
        requestBody: {
          content: {
            'multipart/form-data': {
              schema: {
                $ref: '#/components/schemas/FileUpload'
              }
            }
          }
        },
        responses: {
          200: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ResourcePermission'
                }
              }
            }
          },
          422: {
            $ref: '#/components/responses/HTTP_UNPROCESSABLE_ENTITY'
          },
          500: {
            $ref: '#/components/responses/HTTP_INTERNAL_SERVER_ERROR'
          }
        },
        security: [
          {
            Bearer: []
          }
        ]
      }
    },
    '/media-objects/{id}': {
      get: {
        tags: [
          'MediaObjects'
        ],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          200: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/MediaObject'
                }
              }
            }
          },
          404: {
            $ref: '#/components/responses/HTTP_NOT_FOUND'
          },
          500: {
            $ref: '#/components/responses/HTTP_INTERNAL_SERVER_ERROR'
          }
        },
        security: [
          {
            Bearer: []
          }
        ]
      },
      put: {
        tags: [
          'MediaObjects'
        ],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/FileUpload'
              }
            }
          }
        },
        responses: {
          200: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/MediaObject'
                }
              }
            }
          },
          404: {
            $ref: '#/components/responses/HTTP_NOT_FOUND'
          },
          500: {
            $ref: '#/components/responses/HTTP_INTERNAL_SERVER_ERROR'
          }
        },
        security: [
          {
            Bearer: []
          }
        ]
      },
      delete: {
        tags: [
          'MediaObjects'
        ],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          204: {
            $ref: '#/components/responses/HTTP_NO_CONTENT'
          },
          404: {
            $ref: '#/components/responses/HTTP_NOT_FOUND'
          },
          500: {
            $ref: '#/components/responses/HTTP_INTERNAL_SERVER_ERROR'
          }
        },
        security: [
          {
            Bearer: []
          }
        ]
      }
    },
    '/books': {
      get: {
        tags: [
          'Books'
        ],
        parameters: [
          {
            $ref: '#/components/parameters/q'
          },
          {
            $ref: '#/components/parameters/_sort'
          },
          {
            $ref: '#/components/parameters/_limit'
          },
          {
            $ref: '#/components/parameters/_page'
          },
          {
            $ref: '#/components/parameters/paramsFilter'
          }
        ],
        responses: {
          200: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/BookCollection'
                }
              }
            }
          },
          500: {
            $ref: '#/components/responses/HTTP_INTERNAL_SERVER_ERROR'
          }
        },
        security: [
          {
            Bearer: []
          }
        ]
      },
      post: {
        tags: [
          'Books'
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Book'
              }
            }
          }
        },
        responses: {
          200: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Book'
                }
              }
            }
          },
          404: {
            $ref: '#/components/responses/HTTP_NOT_FOUND'
          },
          500: {
            $ref: '#/components/responses/HTTP_INTERNAL_SERVER_ERROR'
          }
        },
        security: [
          {
            Bearer: []
          }
        ]
      }
    },
    '/books/{id}': {
      get: {
        tags: [
          'Books'
        ],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          200: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Book'
                }
              }
            }
          },
          404: {
            $ref: '#/components/responses/HTTP_NOT_FOUND'
          },
          500: {
            $ref: '#/components/responses/HTTP_INTERNAL_SERVER_ERROR'
          }
        },
        security: [
          {
            Bearer: []
          }
        ]
      },
      put: {
        tags: [
          'Books'
        ],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Book'
              }
            }
          }
        },
        responses: {
          200: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Book'
                }
              }
            }
          },
          404: {
            $ref: '#/components/responses/HTTP_NOT_FOUND'
          },
          500: {
            $ref: '#/components/responses/HTTP_INTERNAL_SERVER_ERROR'
          }
        },
        security: [
          {
            Bearer: []
          }
        ]
      },
      delete: {
        tags: [
          'Books'
        ],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          204: {
            $ref: '#/components/responses/HTTP_NO_CONTENT'
          },
          404: {
            $ref: '#/components/responses/HTTP_NOT_FOUND'
          },
          500: {
            $ref: '#/components/responses/HTTP_INTERNAL_SERVER_ERROR'
          }
        },
        security: [
          {
            Bearer: []
          }
        ]
      }
    }
  },
  components: {
    responses: {
      HTTP_CREATED: {
        content: {
          'application/json': {
            schema: {
              oneOf: [
                {
                  $ref: '#/components/schemas/User'
                },
                {
                  $ref: '#/components/schemas/Role'
                }
              ]
            }
          }
        }
      },
      HTTP_NO_CONTENT: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            }
          }
        }
      },
      HTTP_BAD_REQUEST: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            }
          }
        }
      },
      HTTP_UNAUTHORIZED: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            }
          }
        }
      },
      HTTP_FORBIDDEN: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            }
          }
        }
      },
      HTTP_NOT_FOUND: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            }
          }
        }
      },
      HTTP_UNSUPPORTED_MEDIA_TYPE: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            }
          }
        }
      },
      HTTP_UNPROCESSABLE_ENTITY: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            }
          }
        }
      },
      HTTP_INTERNAL_SERVER_ERROR: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            }
          }
        }
      }
    },
    parameters: {
      q: {
        name: 'q',
        in: 'query',
        required: false,
        schema: {
          type: 'string'
        }
      },
      paramsFilter: {
        name: 'paramsFilter',
        in: 'query',
        required: false,
        explode: true,
        allowEmptyValue: false,
        description: 'Filter by "fieldName_suffix":"filteringValue", <b>i.e.</b> <code>{ "email_eq": "test@test.com", "price_gte: 150"}</code>.<br>Available Suffixes: <ul><li>_eq</li><li>_ne</li><li>_lt</li><li>_lte</li><li>_gt</li><li>_gte</li><ul>',
        schema: {
          type: 'object',
          default: '{}',
        }
      },
      _sort: {
        name: '_sort',
        in: 'query',
        required: false
      },
      _limit: {
        name: '_limit',
        in: 'query',
        required: false,
        schema: {
          type: 'string',
          default: 10
        }
      },
      _page: {
        name: '_page',
        in: 'query',
        required: false,
        schema: {
          type: 'string',
          default: 1
        }
      }
    },
    schemas: {
      AuthUser: {
        required: [
          'email',
          'name',
          'password'
        ],
        type: 'object',
        properties: {
          email: {
            type: 'string',
            example: 'admin@admin.com'
          },
          name: {
            type: 'string',
            example: 'JOHN DOE'
          },
          password: {
            type: 'string',
            example: 'qwerty'
          }
        }
      },
      User: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            readOnly: true
          },
          email: {
            type: 'string',
            example: 'admin@admin.com'
          },
          name: {
            type: 'string',
            example: 'JOHN DOE'
          },
          role: {
            $ref: '#/components/schemas/Role'
          },
          isVerified: {
            type: 'boolean'
          },
          password: {
            type: 'string',
            writeOnly: true
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            readOnly: true
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            readOnly: true
          }
        },
        required: [
          'email',
          'name',
          'role',
          'password'
        ]
      },
      UserCollection: {
        type: 'object',
        properties: {
          totalItems: {
            type: 'number'
          },
          data: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/User'
            }
          }
        }
      },
      Role: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            readOnly: true
          },
          name: {
            type: 'string',
            example: 'Public'
          },
          isAuthenticated: {
            type: 'boolean'
          },
          description: {
            type: 'string'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            readOnly: true
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            readOnly: true
          }
        },
        required: [
          'name',
          'isAuthenticated'
        ]
      },
      RoleCollection: {
        type: 'object',
        properties: {
          totalItems: {
            type: 'number'
          },
          data: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Role'
            }
          }
        }
      },
      ResourcePermission: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            readOnly: true
          },
          resourceName: {
            type: 'string',
            example: 'books'
          },
          methods: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: {
                  type: 'string'
                },
                roles: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Role'
                  }
                }
              }
            }
          },
          description: {
            type: 'string'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            readOnly: true
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            readOnly: true
          }
        },
        required: [
          'name',
          'isAuthenticated'
        ]
      },
      ResourcePermissionCollection: {
        type: 'object',
        properties: {
          totalItems: {
            type: 'number'
          },
          data: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/ResourcePermission'
            }
          }
        }
      },
      MediaObject: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            readOnly: true
          },
          name: {
            type: 'string',
            readOnly: true
          },
          alternativeText: {
            type: 'string'
          },
          caption: {
            type: 'string'
          },
          width: {
            type: 'number',
            readOnly: true
          },
          height: {
            type: 'number',
            readOnly: true
          },
          hash: {
            type: 'string',
            readOnly: true
          },
          ext: {
            type: 'string',
            readOnly: true
          },
          mime: {
            type: 'string',
            readOnly: true
          },
          size: {
            type: 'number',
            readOnly: true
          },
          url: {
            type: 'string',
            readOnly: true
          },
          path: {
            type: 'string',
            readOnly: true
          },
          provider: {
            type: 'string',
            readOnly: true
          },
          providerMetadata: {
            type: 'string',
            readOnly: true
          },
          thumbnail: {
            type: 'object',
            properties: {
              hash: {
                type: 'string',
                readOnly: true
              },
              ext: {
                type: 'string',
                readOnly: true
              },
              mime: {
                type: 'string',
                readOnly: true
              },
              width: {
                type: 'number',
                readOnly: true
              },
              height: {
                type: 'number',
                readOnly: true
              },
              size: {
                type: 'number',
                readOnly: true
              },
              url: {
                type: 'string',
                readOnly: true
              },
              path: {
                type: 'string',
                readOnly: true
              }
            }
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            readOnly: true
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            readOnly: true
          }
        }
      },
      MediaObjectCollection: {
        type: 'object',
        properties: {
          totalItems: {
            type: 'number'
          },
          data: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/MediaObject'
            }
          }
        }
      },
      Error: {
        type: 'object',
        properties: {
          message: {
            type: 'string'
          },
          error: {
            type: 'string'
          }
        }
      },
      Token: {
        type: 'object',
        properties: {
          token: {
            type: 'string'
          }
        }
      },
      FileUpload: {
        type: 'object',
        required: [
          'file'
        ],
        properties: {
          alternativeText: {
            type: 'string'
          },
          caption: {
            type: 'string'
          },
          file: {
            type: 'string',
            format: 'binary'
          }
        }
      },
      Book: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            readOnly: true
          },
          title: {
            type: 'string'
          },
          isbn: {
            type: 'number'
          },
          author: {
            $ref: '#/components/schemas/User'
          },
          isPublished: {
            type: 'boolean'
          },
          cover: {
            $ref: '#/components/schemas/MediaObject'
          },
          images: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/MediaObject'
            }
          },
          publishedAt: {
            type: 'string',
            format: 'date-time'
          },
          tags: {
            type: 'array',
            items: {
              type: 'string'
            }
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            readOnly: true
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            readOnly: true
          }
        },
        required: [
          'title',
          'isbn',
          'author',
          'publishedAt'
        ]
      },
      BookCollection: {
        type: 'object',
        properties: {
          totalItems: {
            type: 'number'
          },
          data: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Book'
            }
          }
        }
      }
    },
    securitySchemes: {
      Bearer: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'To access certain routes of API a valid JWT token must be passed in authorized methods in the \'Authorization\' header.<br>\nGet a valid JWT token from `/auth/login`<br>\nPaste token in the following format <b>xxxxxx.yyyyyyy.zzzzzz</b> here<br>'
      }
    }
  }
};