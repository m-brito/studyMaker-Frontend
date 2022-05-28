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
    path: "/meuscursos",
    children: [
      {
        path: "",
        exact: true,
        render: "../views/meuscursos.html",
        funcao: iniciarMeuscursos,
      },
      {
        path: "/cadastrar",
        exact: true,
        render: "../views/cadastrarcurso.html",
        funcao: iniciarCadastrarCurso,
      },
      {
        path: "/editar/:idCurso",
        exact: true,
        render: "../views/editarCurso.html",
        funcao: iniciarEditarCurso,
      },
      {
        path: "/:idCurso",
        children: [
          {
            path: "",
            exact: true,
            render: "../views/minhasmaterias.html",
            funcao: iniciarMinhasMaterias,
          },
          {
            path: "/materia",
            children: [
              {
                path: "/cadastrar",
                exact: true,
                render: "../views/cadastrarmateria.html",
                funcao: iniciarCadastrarMateria,
              },
              {
                path: "/editar/:idMateria",
                exact: true,
                render: "../views/editarmateria.html",
                funcao: iniciarEditarMateria,
              },
              {
                path: "/:idMateria",
                children: [
                  {
                    path: "",
                    exact: true,
                    render: "../views/meusquestionarios.html",
                    funcao: iniciarMeusQuestionarios,
                  },
                  {
                    path: "/questionario",
                    children: [
                      {
                        path: "/cadastrar",
                        render: "../views/cadastrarquestionario.html",
                        funcao: () => {},
                      },
                      {
                        path: "/editar/:idQuestionario",
                        render: "../views/editarquestionario.html",
                        funcao: () => {},
                      },
                      {
                        path: "/:idQuestionario",
                        render: "../views/responderquestionario.html",
                        funcao: () => {},
                      },
                    ],
                  },
                ]
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "/requisicoes",
    render: "../views/requisicoes.html",
    funcao: () => {},
  },
  {
    path: "",
    render: "../views/feed.html",
    funcao: () => {},
  },
]);

window.config = {
  router,
};

let routerElements = document.createElement("script");
routerElements.src = "../../public/scripts/router-elements.js";
document.body.appendChild(routerElements);
