import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {
  Alert,
  Pane,
  Heading,
  Button,
  BackButton,
  Badge,
  Paragraph,
  Text,
  Small,
  majorScale,
  minorScale
} from 'evergreen-ui'
import { Link } from 'react-router-dom'
import { Connector } from '@xkit-co/xkit.js/lib/api/connector'
import { Connection } from '@xkit-co/xkit.js/lib/api/connection'
import { AuthorizationStatus } from '@xkit-co/xkit.js/lib/api/authorization'
import { toaster } from './toaster'
import Markdown from './markdown'
import ConnectorMark from './connector-mark'
import { friendlyMessage } from './errors'
import withXkit, { XkitConsumer } from './with-xkit'


interface ConnectorDetailProps {
  connector: Connector,
  connection?: Connection
}

interface ConnectorDetailState {
  loading: boolean,
  reconnectLoading: boolean,
  connection?: Connection
}

class ConnectorDetail extends React.Component<XkitConsumer<ConnectorDetailProps>, ConnectorDetailState> {
  constructor (props: XkitConsumer<ConnectorDetailProps>) {
    super(props)

    this.state = {
      loading: false,
      reconnectLoading: false,
      connection: this.props.connection
    }
  }

  handleError = (error: Error): void => {
    toaster.danger(friendlyMessage(error.message))
  }

  handleInstall = async (): Promise<void> => {
    const {
      connector,
      xkit
    } = this.props
    try {
      this.setState({ loading: true })
      const connection = await xkit.connect(connector)
      this.setState({ connection })
      toaster.success(`Installed ${connector.name}`)
    } catch (e) {
      this.handleError(e)
    } finally {
      this.setState({ loading: false })
    }
  }

  handleRemove = async (): Promise<void> => {
    const {
      xkit,
      connector: {
        slug,
        name
      }
    } = this.props
    try {
      this.setState({ loading: true })
      await xkit.removeConnection(slug)
      this.setState({ connection: undefined })
      toaster.success(`Removed ${name}`)
    } catch (e) {
      this.handleError(e)
    } finally {
      this.setState({ loading: false })
    }
  }

  handleReconnect = async (): Promise<void> => {
    const {
      xkit,
      connector: {
        name
      }
    } = this.props
    try {
      this.setState({ reconnectLoading: true })
      const connection = await xkit.reconnect(this.state.connection)
      this.setState({ connection })
      toaster.success(`Reconnected to ${name}`)
    } catch (e) {
      this.handleError(e)
    } finally {
      this.setState({ reconnectLoading: false })
    }
  }


  renderAction (): React.ReactElement {
    const { loading, connection } = this.state

    if (!connection || !connection.enabled) {
      return (
        <Pane>
          <Button
            iconBefore={loading ? null : "add"}
            appearance="primary"
            marginTop={minorScale(1)}
            height={majorScale(5)}
            isLoading={loading}
            onClick={this.handleInstall}
          >
            Install
          </Button>
        </Pane>
      )
    }

    return (
      <Pane>
        <Button
          iconBefore={loading ? null : "trash"}
          marginLeft={majorScale(1)}
          marginTop={minorScale(1)}
          height={majorScale(5)}
          isLoading={loading}
          onClick={this.handleRemove}
        >
          Remove
        </Button>
      </Pane>
    )
  }

  renderBadge (): React.ReactElement {
    const { connection } = this.state

    if (!connection || !connection.enabled) {
      return
    }

    const { authorization } = connection
    if (authorization && authorization.status !== AuthorizationStatus.error) {
      return (
        <Pane display="flex" flexDirection="column" justifyContent="center" marginLeft={majorScale(3)}>
          <Badge color="green">Installed</Badge>
        </Pane>
      )
    }
    
    return (
      <Pane display="flex" flexDirection="column" justifyContent="center" marginLeft={majorScale(2)}>
        <Badge color="yellow">Not Connected</Badge>
      </Pane>
    )
  }

  renderAuthAlert (): React.ReactElement {
    const { connector } = this.props
    const { connection, reconnectLoading } = this.state
    if (!connection || !connection.enabled) {
      return
    }

    const { authorization } = connection
    if (authorization && authorization.status !== AuthorizationStatus.error) {
      return
    }

    return (
      <Alert
        intent="warning"
        appearance="card"
        marginTop={majorScale(3)}
        title={
          <>
            Connection error
            <Button
              float="right"
              appearance="primary"
              iconBefore={reconnectLoading ? null : "refresh"}
              isLoading={reconnectLoading}
              height={majorScale(4)}
              onClick={this.handleReconnect}
            >
              Reconnect
            </Button>
          </>
        }
      >
        <Text size={400} color="muted">
          Your connection to {connector.name} is inactive. Reconnect to continue using this integration.
        </Text>
      </Alert>
    )
  }

  renderDescription (): React.ReactElement {
    const { connector } = this.props

    if (!connector.description) {
      return <Markdown size="large" text={connector.about} />
    }

    return (
      <>
        <Markdown size="large" text={connector.description} />
        <Heading size={500} marginTop="default">
          About {connector.name}
        </Heading>
        <Markdown size="large" text={connector.about} />
      </>
    )
  }

  render (): React.ReactElement {
    const {
      connector: {
        name,
        short_description,
        mark_url
      }
    } = this.props
    const { connection } = this.state
    
    return (
      <Pane>
        {this.renderAuthAlert()}
        <Pane display="flex" marginTop={majorScale(3)}>  
          <Pane flexGrow={1} display="flex" alignItems="center">
            <ConnectorMark markUrl={mark_url} size={majorScale(6)} />
            <Pane marginLeft={majorScale(2)}>
              <Pane display="flex">
                <Heading size={700}>
                  {name}
                </Heading>
                {this.renderBadge()}
              </Pane>
              <Text color="muted">{short_description}</Text>
            </Pane>
          </Pane>
          {this.renderAction()}
        </Pane>
        {this.renderDescription()}
        <Pane marginTop={majorScale(3)}>
          <BackButton
            is={Link}
            to="/"
          >Back to Catalog</BackButton>
        </Pane>
      </Pane>
    )
  }
}

export default withXkit(ConnectorDetail)