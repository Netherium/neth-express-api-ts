import { Request, Response, Router } from 'express';
import BookModel from '../models/book.model';

/**
 * BookController.ts
 * @description :: Server-side logic for managing Books.
 */
export class BookController {
  public router = Router();

  constructor() {
    this.router.get('/', this.list);
    this.router.get('/:id', this.show);
    this.router.post('/', this.create);
    this.router.put('/:id', this.update);
    this.router.delete('/:id', this.remove);
  }

  /**
   * BookController.list()
   */
  private list(req: Request, res: Response): Promise<Response> {
    return BookModel.find()
      .then((books) => res.json(books))
      .catch((err) =>
        res.status(500).json({
          message: 'Error when getting book.',
          error: err
        })
      );
  }

  /**
   * BookController.show()
   */
  private show(req: Request, res: Response): Promise<Response> {
    const id = req.params.id;
    return BookModel.findById(id)
      .then((book) => {
        if (!book) {
          return res.status(404).json({
            message: 'No such book'
          });
        }
        return res.json(book);
      })
      .catch((err) => res.status(500).json({
        message: 'Error when getting book.',
        error: err
      }));

    // Async implementation
    // try {
    //   const book = await BookModel.findOne({_id: id});
    //   return res.json(book);
    // } catch (err) {
    //   return res.status(500).json({
    //     message: 'Error when getting book.',
    //     error: err
    //   });
    // }
  }

  /**
   * BookController.create()
   */
  private create(req: Request, res: Response): Promise<Response> {
    const book = {
      title: req.body.title,
      description: req.body.description
    };
    return BookModel.create(book)
      .then((newBook) => res.status(201).json(newBook))
      .catch((err) => res.status(500).json({
        message: 'Error when creating book',
        error: err
      }));
  }

  /**
   * BookController.update()
   */
  private update(req: Request, res: Response): Promise<Response> {
    const id = req.params.id;
    const book = {
      ...(req.body.title && {title: req.body.title}),
      ...(req.body.description && {description: req.body.description})
    };
    return BookModel.findByIdAndUpdate(id, book, {new: true})
      .then((newBook) => {
        if (!newBook) {
          return res.status(404).json({
            message: 'No such book'
          });
        }
        return res.json(newBook);
      })
      .catch((err) => res.status(500).json({
          message: 'Error when updating book.',
          error: err
        })
      );
  }

  /**
   * BookController.remove()
   */
  private remove(req: Request, res: Response): Promise<Response> {
    const id = req.params.id;
    return BookModel.findByIdAndDelete(id)
      .then((newBook) => {
          if (!newBook) {
            return res.status(404).json({
              message: 'No such book'
            });
          }
          return res.status(204).json();
        }
      )
      .catch((err) => res.status(500).json({
          message: 'Error when deleting book.',
          error: err
        })
      );
  }
}
