import React from 'react'


function About() {
  return (
    <div className="box">
      <h1>About</h1>
      <p>
        Chamonix is one of the most notorious ski resorts in the world and
        Chamsocial is Chamonix online. You can get in touch with over 16 000 users that
        help each other with accommodation, bank issues or finding each others lost dogs.
        <br />
        Get started and join us now.
      </p>

      <h2>History</h2>
      <p>
        Chamsocial has a long history of being the largest community platform in Chamonix.
        It was previously called ChamShare and this name is still being used by the old users.
        During the summer 2014, the new directions of Chamsocial was set by three passionate
        inhabitants of Chamonix and the decision to make a new platform was made.
      </p>
      <table className="table table--striped">
        <tbody>
          <tr>
            <td>1999</td>
            <td>ChamShare was created</td>
          </tr>
          <tr>
            <td>2011</td>
            <td>Chamsocial took over</td>
          </tr>
          <tr>
            <td>2014</td>
            <td>Chamsocial get new admins</td>
          </tr>
          <tr>
            <td>2015</td>
            <td>New version of Chamsocial was launched</td>
          </tr>
          <tr>
            <td>2019</td>
            <td>Another version of ChamSocial was deployed</td>
          </tr>
          <tr>
            <td>2020</td>
            <td>July 24 the current version was deployed</td>
          </tr>
          <tr>
            <td>2023</td>
            <td>September 13 moved server from Gandi to Oracle</td>
          </tr>
        </tbody>
      </table>

      <p>
        All code are available on {' '}
        <a href="https://github.com/chamsocial" target="_blank" rel="noreferrer noopener">
          Github
        </a>.
        {' '}Pull requests are welcome!
      </p>

      <h2>Contact</h2>
      <p>
        If you have any questions or want to get in contact you can email the address:
        {' '}<a href="mailto:Chamsocial@theskilocker.com">chamsocial@spathon.com</a>
      </p>
    </div>
  )
}


export default About
