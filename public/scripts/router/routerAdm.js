  class Route {
    #regexp;
  
    path = "";
    render = () => `<p>${this.path}</p>`;
  
    funcao = () => "";
  
    exec(path) {
      return this.#regexp.exec(path).groups;
    }
  
    test(path) {
      return this.#regexp.test(path);
    }
  
    constructor(config) {
      // console.log(config.render);
  
      // Assign only relevant props
      for (const prop in config) {
        // if(prop != "funcao") {
        if (prop in this) this[prop] = config[prop];
        // }
      }
  
      // Replace /:param with named capture group
      let reStr = "^" + this.path.replace(/:(\w+)/gi, "(?<$1>[\\w.-]+)");
  
      // Exact regex match
      if (config.exact) reStr += "$";
  
      this.#regexp = new RegExp(reStr);
    }
  }
  
  class Router {
    routes = [];
  
    match(path) {
      return this.routes.find((route) => route.test(path));
    }
  
    constructor(routes) {
      // Base config
      let config = { path: "" };
  
      // Flatten children
      this.routes = routes.flatMap(
        function configureRoute(config) {
          config.path = this.path + config.path;
          if (config.children) {
            // console.log(config)
            return config.children.flatMap(configureRoute.bind(config));
          } else {
            // console.log("2 - this -> "+this.path+" config -> "+config.path)
            return [new Route(config)];
          }
        }.bind(config)
      );
  
      // console.log(this);
    }
  
    static routes(routes) {
      if (routes instanceof Array) {
        return new Router(routes);
      }
    }
  }
  
  window.Router = Router;
  
  let router = Router.routes([
    {
        path: "/administrador",
        children: [
          {
            path: "/requisicoes",
            children: [
              {
                path: "",
                exact: true,
                render: "../views/administrador/requisicoes/requisicoes.html",
                funcao: iniciarRequisicoes,
              },
              {
                path: "/aluno/:idAluno",
                children: [
                  {
                    path: "",
                    exact: true,
                    render: "../views/administrador/requisicoes/requisicoesaluno.html",
                    funcao: iniciarRequisicoesAluno,
                  },
                  {
                    path: "/curso/:idCurso",
                    children: [
                      {
                        path: "",
                        exact: true,
                        render: "../views/administrador/analisar/curso.html",
                        funcao: iniciarAnalisarCurso,
                      },
                      {
                        path: "/materia/:idMateria",
                        exact: true,
                        render: "../views/administrador/analisar/materia.html",
                        funcao: iniciarAnalisarMateria,
                      },
                    ]
                  },
                  {
                    path: "/questionario/:idQuestionario",
                    exact: true,
                    render: "../views/administrador/analisar/questionario.html",
                    funcao: iniciarAnalisarQuestionario,
                  },
                ]
              },
            ]
          },
          {
            path: "/usuariosconfiaveis",
            render: "../views/administrador/usuariosconfiaveis/usuariosconfiaveis.html",
            exact: false,
            funcao: () => {},
          },
          {
            path: "/perfil",
            render: "../views/aluno/usuario/perfil.html",
            exact: false,
            funcao: iniciarPerfilUsuario,
          },
        ],
    },
    {
      path: "",
      exact: true,
      render: "../views/administrador/requisicoes/requisicoes.html",
      funcao: iniciarRequisicoes,
    },
  ]);
  
  window.config = {
    router,
  };
  
  let routerElements = document.createElement("script");
  routerElements.src = "../../public/scripts/router/router-elements.js";
  document.body.appendChild(routerElements);
  