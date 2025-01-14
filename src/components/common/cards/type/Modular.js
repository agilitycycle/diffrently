import classNames from 'classnames';

//
// Card

export const Modular = ({ children, className, ...props }) => {
  return (
    <div className={classNames('', className)} {...props}>
      {children}
    </div>
  );
};

//
// Card header

Modular.Header = ({ className, children, ...props }) => {
  return (
    <div className={classNames('', className)} {...props}>
      {children}
    </div>
  );
};

//
// Card body

Modular.Body = ({ className, children, ...props }) => {
  return (
    <div className={classNames('', className)} {...props}>
      {children}
    </div>
  );
};

//
// Card footer

Modular.Footer = ({ className, children, ...props }) => {
  return (
    <div className={classNames('', className)} {...props}>
      {children}
    </div>
  );
};

//
// Card text

Modular.Text = ({ className, children, ...props }) => {
  return (
    <div className={classNames('', className)} {...props}>
      {children}
    </div>
  );
};

//
// Card image

Modular.Image = ({ className, children, ...props }) => {
  return (
    <div className={classNames('', className)} {...props}>
      {children}
    </div>
  );
};

//
// Card link

Modular.Link = ({ className, children, ...props }) => {
  return (
    <div className={classNames('', className)} {...props}>
      {children}
    </div>
  );
};
