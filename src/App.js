import React, { Fragment } from "react";

import { GenesisFormComponent } from "./GenesisForm";

export class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: undefined,
      update: false,
    };
  }

  onUpdatePage = (payload) => {
    if (typeof dappyRChain === "undefined") {
      console.warn("window.dappyRChain is undefined, cannot deploy page");
      return;
    }

    const newNonce = blockchainUtils.generateNonce();

    // Storing the page value in the files module
    const term = `new entryCh, lookup(\`rho:registry:lookup\`), stdout(\`rho:io:stdout\`) in {
  lookup!(\`rho:id:REGISTRY_URI\`, *entryCh) |

  for(entry <- entryCh) {
    entry!(
      {
        "type": "ADD_OR_UPDATE",
        "payload": {
          "id": "page",
          "file": {
            "text": "${encodeURI(payload.text)}",
            "title": "${encodeURI(payload.title)}",
          },
          "nonce": "${newNonce}",
          "signature": "SIGN"
        }
      },
      *stdout
    )
  }
}`;
    dappyRChain
      .transaction({
        term: term,
        signatures: {
          SIGN: payload.nonce,
        },
      })
      .then((a) => {
        this.setState({
          modal: "transaction-sent",
          update: false,
        });
      });
  };

  render() {
    if (this.state.modal === "transaction-sent") {
      return (
        <div className="modal">
          <div className="modal-background"></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Transaction successfully sent</p>
              <button
                onClick={() => this.setState({ modal: undefined })}
                className="delete"
                aria-label="close"
              ></button>
            </header>
            <section className="modal-card-body">
              Transaction was successfully sent. Wait few minutes, reload, and
              you should see the page updated.
            </section>
            <footer className="modal-card-foot">
              <button
                onClick={() => this.setState({ modal: undefined })}
                class="button"
              >
                Ok
              </button>
            </footer>
          </div>
        </div>
      );
    }

    if (this.props.text && !this.state.update) {
      return (
        <Fragment>
          <div className="page-text">{this.props.text}</div>
          <a
            className="update-page"
            onClick={() => {
              this.setState({
                update: true,
              });
            }}
          >
            Update page (admin only)
          </a>
        </Fragment>
      );
    }

    return (
      <Fragment>
        <GenesisFormComponent
          onUpdatePage={this.onUpdatePage}
          nonce={this.props.nonce}
          text={this.props.text}
          title={this.props.title}
        ></GenesisFormComponent>
      </Fragment>
    );
  }
}
