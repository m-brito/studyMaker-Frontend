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
    path: "/aluno",
    children: [
      {
        path: "/meuscursos",
        children: [
          {
            path: "",
            exact: true,
            render: "../views/aluno/curso/meuscursos.html",
            funcao: iniciarMeuscursos,
          },
          {
            path: "/cadastrar",
            exact: true,
            render: "../views/aluno/curso/cadastrarcurso.html",
            funcao: iniciarCadastrarCurso,
          },
          {
            path: "/editar/:idCurso",
            exact: true,
            render: "../views/aluno/curso/editarCurso.html",
            funcao: iniciarEditarCurso,
          },
          {
            path: "/:idCurso",
            children: [
              {
                path: "",
                exact: true,
                render: "../views/aluno/materia/minhasmaterias.html",
                funcao: iniciarMinhasMaterias,
              },
              {
                path: "/materia",
                children: [
                  {
                    path: "/cadastrar",
                    exact: true,
                    render: "../views/aluno/materia/cadastrarmateria.html",
                    funcao: iniciarCadastrarMateria,
                  },
                  {
                    path: "/editar/:idMateria",
                    exact: true,
                    render: "../views/aluno/materia/editarmateria.html",
                    funcao: iniciarEditarMateria,
                  },
                  {
                    path: "/:idMateria",
                    children: [
                      {
                        path: "",
                        exact: true,
                        render: "../views/aluno/questionario/meusquestionarios.html",
                        funcao: iniciarMeusQuestionarios,
                      },
                      {
                        path: "/questionario",
                        children: [
                          {
                            path: "/cadastrar",
                            render: "../views/aluno/questionario/cadastrarquestionario.html",
                            funcao: iniciarCadastrarQuestionario,
                          },
                          {
                            path: "/editar/:idQuestionario",
                            render: "../views/aluno/questionario/editarquestionario.html",
                            funcao: iniciarEditarQuestionario,
                          },
                        ],
                      },
                    ]
                  },
                ],
              },
            ],
          },
        ]
      },
      {
        path: "/requisicoes",
        render: "../views/aluno/requisicoes/requisicoes.html",
        exact: false,
        funcao: iniciarRequisicoesAluno,
      },
      {
        path: "/feed",
        children: [
          {
            path: "",
            exact: true,
            render: "../views/aluno/feed/cursos.html",
            funcao: iniciarFeedCursos,
          },
          {
            path: "/curso/:idCurso",
            children: [
              {
                path: "",
                exact: true,
                render: "../views/aluno/feed/materias.html",
                funcao: iniciarFeedMaterias,
              },
              {
                path: "/materia/:idMateria",
                exact: true,
                render: "../views/aluno/feed/questionarios.html",
                funcao: iniciarFeedQuestionarios,
              },
            ]
          },
        ]
      },
    ],
  },
  {
    path: "/responderQuestionario/curso/:idCurso/materia/:idMateria/questionario/:idQuestionario",
    render: "../views/aluno/questionario/responderquestionario.html",
    funcao: iniciarResponderQuestionarios,
    exact: false,
  },
  {
    path: "/revisao/curso/:idCurso/materia/:idMateria/questionario/:idQuestionario/resultado/:idResultado",
    render: "../views/aluno/questionario/revisaoquestionario.html",
    funcao: iniciarRevisaoQuestionarios,
    exact: false,
  },
  {
    path: "/relatorio/curso/:idCurso/materia/:idMateria/questionario/:idQuestionario",
    render: "../views/aluno/relatorio/relatorio.html",
    funcao: iniciarRelatorioQuestionario,
    exact: false,
  },
  // {
  //   path: "",
  //   exact: true,
  //   render: "../views/aluno/feed/cursos.html",
  //   funcao: () => {iniciarFeedCursos},
  // },
]);

window.config = {
  router,
};

let routerElements = document.createElement("script");
routerElements.src = "../../public/scripts/router/router-elements.js";
document.body.appendChild(routerElements);
