import React from 'react';
import ReactDOM from 'react-dom';
import { BoxIcon } from './Icons';
import { assetUrl } from '../helpers';

const CollapseTitle = (props) => {
  return (
    <a href="#" className="collapse-title" onClick={props.toggle}>
      <BoxIcon /> { props.children }
      <div className="collapse-icon">
        <span className={props.collapsed ? 'arrow-down' : 'arrow-up'}></span>
      </div>
    </a>
  )
};

export default class Widget extends React.Component {

  constructor(props) {
    super(props);
    
    // Variables for refs.
    this.refWidgetBody = null;
    this.refWidgetBodyInner = null;

    // Event handler binding
    this.handleResize = this.handleResize.bind(this);

    this.state = {
      collapsed: false
    }
  }

  toggleCollapse() {
    this.setState({ collapsed: !this.state.collapsed });
  }

  resetCollapse() {
    this.setState({ collapsed: false });
  }

  updateCollapse() {
    // Set widget body height for collapse animation.
    if (this.refWidgetBody && this.refWidgetBodyInner) {
      this.refWidgetBody.style.height = (this.state.collapsed ? 0 : this.refWidgetBodyInner.offsetHeight) + 'px';
    }
  }

  handleResize() {
    this.updateCollapse();
  }

  componentDidMount () {
    this.updateCollapse();
    window.addEventListener('resize', this.handleResize);
  }
  
  componentDidUpdate () {
    this.updateCollapse();
  }
  
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }
  
  render() {
    const { navigating, title, content, navPrev, navNext, nextTitle } = this.props;
    const { collapsed } = this.state;
    const description = { __html: content.description };
    const widgetClasses = 'widget' + (collapsed ? ' collapsed' : '') + (navigating ? ' navigating' : '')
    const toggle = (ev) => {
      ev.preventDefault();
      this.toggleCollapse();
    };

    // Function for calling collapse height re-calc upon async image load.
    const onImageLoad = () => {
      this.updateCollapse();
    };

    return (
      <div className={widgetClasses}>
        <div className="widget-header">
           <CollapseTitle toggle={toggle} collapsed={collapsed}>
             { title }
           </CollapseTitle>
        </div>
        <div className="widget-body" ref={ ref => { this.refWidgetBody = ref } }>
          <div className="inner" ref={ ref => { this.refWidgetBodyInner = ref } }>
            <div className="widget-content" onLoad={onImageLoad}> {/* Catch any bubbled image async onload events */}
              { content.thumbnail && 
                <div className="media-left">
                  <img className="thumbnail" src={assetUrl(content.thumbnail)} alt="Thumbnail image"/>
                </div>
              }
              <div className="description" dangerouslySetInnerHTML={description}></div>
            </div>
            <div className="widget-footer">
              { navPrev &&
                <div className="nav-block previous">
                  <a href="#"onClick={navPrev}>
                    <span className="arrow-nav">
                      <span className="arrow-left"></span>
                    </span>
                    <span className="text">
                      Prev
                    </span>
                  </a>
                </div>
              }
              { navNext &&
                <div className="nav-block next">
                  <a href="#" onClick={navNext}>
                    <span className="text">{ nextTitle }</span>
                    <span className="arrow-nav">
                      <span className="arrow-right"></span>
                    </span>
                  </a>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Widget.propTypes = {
  content: React.PropTypes.object,
  navigating: React.PropTypes.bool,
  navNext: React.PropTypes.func,
  navPrev: React.PropTypes.func,
  nextTitle: React.PropTypes.string,
  title: React.PropTypes.string
}

Widget.defaultProps = {
  content: {},
  navigating: false,
  navNext: null,
  navPrev: null,
  nextTitle: '',
  title: ''
}