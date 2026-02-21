import React, { useEffect, useState } from 'react';
import { Loader } from '../Loader';
import * as PeopleService from '../../api/person';
import { Person } from '../../types';
import { Link, useParams } from 'react-router-dom';
import classNames from 'classnames';

export const PeoplePage: React.FC = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { slug } = useParams();

  useEffect(() => {
    setLoading(true);
    setError('');
    PeopleService.getPeople()
      .then(setPeople)
      .catch(() => {
        setError('Something went wrong');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      <h1 className="title">People Page</h1>

      <div className="block">
        <div className="box table-container">
          {loading && <Loader />}

          {error && (
            <p data-cy="peopleLoadingError" className="has-text-danger">
              {error}
            </p>
          )}
          {!loading && !error && people.length === 0 ? (
            <p data-cy="noPeopleMessage">There are no people on the server</p>
          ) : (
            <></>
          )}
          {!loading && !error && people.length > 0 && (
            <table
              data-cy="peopleTable"
              className="table is-striped is-hoverable is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Sex</th>
                  <th>Born</th>
                  <th>Died</th>
                  <th>Mother</th>
                  <th>Father</th>
                </tr>
              </thead>

              <tbody>
                {people.map(p => {
                  const mother = people.find(x => x.name === p.motherName);
                  const father = people.find(x => x.name === p.fatherName);

                  return (
                    <tr
                      data-cy="person"
                      key={p.slug}
                      className={classNames({
                        'has-background-warning': p.slug === slug,
                      })}
                    >
                      <td>
                        <Link
                          to={`/people/${p.slug}`}
                          className={classNames({
                            'has-text-danger': p.sex === 'f',
                          })}
                        >
                          {p.name}
                        </Link>
                      </td>

                      <td>{p.sex}</td>
                      <td>{p.born}</td>
                      <td>{p.died}</td>
                      <td>
                        {mother ? (
                          <Link
                            to={`/people/${mother.slug}`}
                            className={classNames({
                              'has-text-danger': mother.sex === 'f',
                            })}
                          >
                            {mother.name}
                          </Link>
                        ) : !p.motherName ? (
                          '-'
                        ) : (
                          p.motherName
                        )}
                      </td>
                      <td>
                        {father ? (
                          <Link to={`/people/${father.slug}`}>
                            {' '}
                            {father.name}
                          </Link>
                        ) : !p.fatherName ? (
                          '-'
                        ) : (
                          p.fatherName
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};
