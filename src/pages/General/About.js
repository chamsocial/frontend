import React from 'react'

function About() {
  return (
    <div className="box">
      <h1>About</h1>
      <p>
        Chamonix is one of the most notorious ski resorts in the world and
        Chamsocial is Chamonix online. You can get in touch with over 11 500 users that
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
      <table className="table">
        <tbody>
          <tr className="small">
            <td>ChamShare was created.</td>
            <td>Chamsocial took over.</td>
            <td>Chamsocial get new admins.</td>
            <td>New version of Chamsocial was launched.</td>
            <td>Development of this version of ChamSocial.</td>
          </tr>
          <tr>
            <td>1999</td>
            <td>2011</td>
            <td>2014</td>
            <td>2015</td>
            <td>2019</td>
          </tr>
        </tbody>
      </table>

      <h2>Contact</h2>
      <p>
        If you have any questions or want to get in contact you can email the address:
        <a href="mailto:Chamsocial@theskilocker.com">Chamsocial@theskilocker.com</a>
      </p>
    </div>
  )
}

export default About
