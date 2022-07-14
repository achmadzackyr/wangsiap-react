import Breadcrumb from 'react-bootstrap/Breadcrumb';

function BreadcrumbComponent({ prevs, current }) {
  return (
    <Breadcrumb>
      <Breadcrumb.Item href="/beranda">Beranda</Breadcrumb.Item>
      {prevs &&
        prevs.map((p, index) => (
          <Breadcrumb.Item href={p.link} key={index}>
            {p.text}
          </Breadcrumb.Item>
        ))}
      <Breadcrumb.Item active>{current}</Breadcrumb.Item>
    </Breadcrumb>
  );
}

export default BreadcrumbComponent;
